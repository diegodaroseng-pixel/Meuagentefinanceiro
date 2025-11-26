import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - List all transactions
export async function GET() {
    try {
        const transactions = await prisma.transaction.findMany({
            orderBy: { date_incurred: 'desc' },
        });
        return NextResponse.json({ transactions });
    } catch (error: any) {
        console.error('Get error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch transactions' },
            { status: 500 }
        );
    }
}

// POST - Create transactions
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { transactions, bank_name, card_name, card_holder } = body;

        const created = await prisma.transaction.createMany({
            data: transactions.map((tx: any) => ({
                date_incurred: new Date(tx.date_incurred),
                date_payment: new Date(tx.date_payment),
                description: tx.description,
                amount: tx.amount,
                currency: 'BRL',
                category: tx.category,
                behavior_class: tx.behavior_class,
                installment_current: tx.installment_current || 1,
                installment_total: tx.installment_total || 1,
                payment_method: 'Cartão',
                entity: tx.entity,
                sentiment: 'Planejado',
                source_file: 'upload_nextjs',
                is_verified: true,
                is_auto_generated: false,
                bank_name,
                card_name,
                card_holder,
            })),
        });

        return NextResponse.json({ success: true, savedCount: created.count });
    } catch (error: any) {
        console.error('Save error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to save transactions' },
            { status: 500 }
        );
    }
}

// PUT - Update transaction
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, field, value } = body;

        await prisma.transaction.update({
            where: { id },
            data: { [field]: value },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Update error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update transaction' },
            { status: 500 }
        );
    }
}

// DELETE - Delete transactions
export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { ids } = body;

        const deleted = await prisma.transaction.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        return NextResponse.json({ success: true, deletedCount: deleted.count });
    } catch (error: any) {
        console.error('Delete error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete transactions' },
            { status: 500 }
        );
    }
}
