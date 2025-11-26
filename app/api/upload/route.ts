import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(request: NextRequest) {
    try {
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

        // Extract JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No JSON found in response');
        }

        const data = JSON.parse(jsonMatch[0]);

        // Add status to each transaction (simulate duplicate check)
        data.transactions = data.transactions.map((tx: any) => ({
            ...tx,
            status: 'new', // In real app, check against database
        }));

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to process file' },
            { status: 500 }
        );
    }
}
