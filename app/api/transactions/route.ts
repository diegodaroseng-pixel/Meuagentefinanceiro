import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

// GET - List all transactions
export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const transactions = await prisma.transaction.findMany({
            where: { userId },
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
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { transactions, bank_name, card_name, card_holder } = body;

        let totalCreated = 0;

        // Process each transaction individually to generate installments
        for (const tx of transactions) {
            const installmentTotal = tx.installment_total || 1;
            const installmentCurrent = tx.installment_current || 1;

            // If it's an installment purchase, generate all installments
            if (installmentTotal > 1) {
                const baseDate = new Date(tx.date_incurred);
                const basePaymentDate = new Date(tx.date_payment);

                // Generate all installments (past, current, and future)
                for (let i = 1; i <= installmentTotal; i++) {
                    // Calculate date for this installment
                    const monthsDiff = i - installmentCurrent;
                    const installmentDate = new Date(baseDate);
                    installmentDate.setMonth(installmentDate.getMonth() + monthsDiff);

                    const installmentPaymentDate = new Date(basePaymentDate);
                    installmentPaymentDate.setMonth(installmentPaymentDate.getMonth() + monthsDiff);

                    // Check if this installment already exists
                    const existing = await prisma.transaction.findFirst({
                        where: {
                            userId,
                            description: tx.description,
                            amount: tx.amount,
                            installment_current: i,
                            installment_total: installmentTotal,
                        },
                    });

                    if (!existing) {
                        // Update description to reflect correct installment number
                        let updatedDescription = tx.description;

                        // Replace installment number pattern (handles "Parcela X/Y", "X/Y", etc)
                        const installmentPattern = /(\d+)\/(\d+)/g;
                        updatedDescription = updatedDescription.replace(
                            installmentPattern,
                            `${i}/${installmentTotal}`
                        );

                        await prisma.transaction.create({
                            data: {
                                userId,
                                date_incurred: installmentDate,
                                date_payment: installmentPaymentDate,
                                description: updatedDescription,
                                amount: tx.amount,
                                currency: 'BRL',
                                category: tx.category,
                                behavior_class: tx.behavior_class,
                                installment_current: i,
                                installment_total: installmentTotal,
                                payment_method: 'Cartão',
                                entity: tx.entity,
                                sentiment: 'Planejado',
                                source_file: 'upload_nextjs',
                                is_verified: i === installmentCurrent,
                                is_auto_generated: i !== installmentCurrent,
                                is_forecast: i > installmentCurrent,
                                bank_name,
                                card_name,
                                card_holder,
                            },
                        });
                        totalCreated++;
                    }
                }
            } else {
                // Single transaction (no installments)
                await prisma.transaction.create({
                    data: {
                        userId,
                        date_incurred: new Date(tx.date_incurred),
                        date_payment: new Date(tx.date_payment),
                        description: tx.description,
                        amount: tx.amount,
                        currency: 'BRL',
                        category: tx.category,
                        behavior_class: tx.behavior_class,
                        installment_current: 1,
                        installment_total: 1,
                        payment_method: 'Cartão',
                        entity: tx.entity,
                        sentiment: 'Planejado',
                        source_file: 'upload_nextjs',
                        is_verified: true,
                        is_auto_generated: false,
                        bank_name,
                        card_name,
                        card_holder,
                    },
                });
                totalCreated++;
            }
        }

        return NextResponse.json({ success: true, savedCount: totalCreated });
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
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Check if it's a full update or single field update
        if (body.updates) {
            // Full update
            const { id, updates } = body;

            // Format dates if present
            if (updates.date_incurred) updates.date_incurred = new Date(updates.date_incurred);
            if (updates.date_payment) updates.date_payment = new Date(updates.date_payment);
            if (updates.amount) updates.amount = parseFloat(updates.amount);

            await prisma.transaction.update({
                where: { id, userId },
                data: updates,
            });
        } else {
            // Single field update (legacy support)
            const { id, field, value } = body;
            await prisma.transaction.update({
                where: { id, userId },
                data: { [field]: value },
            });
        }

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
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { ids } = body;

        const deleted = await prisma.transaction.deleteMany({
            where: {
                id: { in: ids },
                userId,
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
