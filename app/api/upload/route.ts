import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            console.error('Missing GOOGLE_API_KEY');
            return NextResponse.json({ error: 'Server configuration error: Missing API Key' }, { status: 500 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');

        // Determine MIME type
        const mimeType = file.type || 'application/pdf';

        // Call Gemini API
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
Você é um assistente financeiro especializado em extrair transações de documentos.

Analise este documento e extraia TODAS as transações financeiras encontradas.

Para cada transação, retorne um objeto JSON com:
- description: descrição da transação
- amount: valor (número positivo)
- date_incurred: data da compra (YYYY-MM-DD)
- date_payment: data de vencimento (YYYY-MM-DD)
- category: categoria (Alimentação, Transporte, Lazer, etc)
- behavior_class: tipo (Essencial, Supérfluo, Lazer, Investimento)
- installment_current: parcela atual (número, padrão 1)
- installment_total: total de parcelas (número, padrão 1)
- entity: estabelecimento/loja

Também extraia:
- bank_name: nome do banco
- card_number: últimos 4 dígitos do cartão
- card_holder: nome do titular

Retorne APENAS um JSON válido no formato:
{
  "transactions": [...],
  "bank_name": "...",
  "card_number": "...",
  "card_holder": "..."
}
`;

        const result = await model.generateContent([
            {
                inlineData: {
                    mimeType,
                    data: base64,
                },
            },
            prompt,
        ]);

        const response = result.response.text();
        console.log('Gemini raw response:', response.substring(0, 200) + '...'); // Log start of response

        // Extract JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error('No JSON found in response:', response);
            throw new Error('Failed to parse AI response: No JSON found');
        }

        let data;
        try {
            data = JSON.parse(jsonMatch[0]);
        } catch (e) {
            console.error('JSON parse error:', e, 'Response:', response);
            throw new Error('Failed to parse AI response: Invalid JSON');
        }

        // Check for duplicates in database
        if (data.transactions && data.transactions.length > 0) {
            const checkedTransactions = await Promise.all(
                data.transactions.map(async (tx: any) => {
                    // Check for exact match
                    const exactMatch = await prisma.transaction.findFirst({
                        where: {
                            userId,
                            description: tx.description,
                            amount: tx.amount,
                            date_incurred: new Date(tx.date_incurred),
                        },
                    });

                    if (exactMatch) {
                        return { ...tx, status: 'exact' };
                    }

                    // Check for similar match (same description and amount, different date)
                    const similarMatch = await prisma.transaction.findFirst({
                        where: {
                            userId,
                            description: tx.description,
                            amount: tx.amount,
                        },
                    });

                    if (similarMatch) {
                        return { ...tx, status: 'similar' };
                    }

                    return { ...tx, status: 'new' };
                })
            );

            data.transactions = checkedTransactions;
        } else {
            data.transactions = [];
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to process file' },
            { status: 500 }
        );
    }
}
