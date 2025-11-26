import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    let generatedCount = 0;

    // 1. Find future installments
    const installmentTransactions = await prisma.transaction.groupBy({
      by: ['description', 'installment_total'],
      where: {
        installment_total: { gt: 1 },
        is_forecast: false,
      },
      _max: {
        installment_current: true,
        date_incurred: true,
        date_payment: true,
      },
    });

    for (const group of installmentTransactions) {
      const currentInstallment = group._max.installment_current || 1;
      const totalInstallments = group.installment_total;

      // Get the original transaction
      const original = await prisma.transaction.findFirst({
        where: {
          description: group.description,
          installment_total: totalInstallments,
        },
      });

      if (!original) continue;

      // Generate future installments
      for (let i = currentInstallment + 1; i <= totalInstallments; i++) {
        const baseDate = new Date(group._max.date_incurred!);
        const futureDate = new Date(baseDate);
        futureDate.setMonth(futureDate.getMonth() + (i - currentInstallment));

        const paymentDate = new Date(group._max.date_payment!);
        const futurePaymentDate = new Date(paymentDate);
        futurePaymentDate.setMonth(futurePaymentDate.getMonth() + (i - currentInstallment));

        // Check if forecast already exists
        const existing = await prisma.transaction.findFirst({
          where: {
            description: group.description,
            installment_current: i,
            installment_total: totalInstallments,
            is_forecast: true,
          },
        });

        if (!existing) {
          await prisma.transaction.create({
            data: {
              date_incurred: futureDate,
              date_payment: futurePaymentDate,
              description: original.description,
              amount: original.amount,
              currency: original.currency,
              category: original.category,
              behavior_class: original.behavior_class,
              installment_current: i,
              installment_total: totalInstallments,
              payment_method: original.payment_method,
              entity: original.entity,
              sentiment: original.sentiment,
              source_file: 'forecast_generated',
              is_verified: false,
              is_auto_generated: true,
              is_forecast: true,
              forecast_paid: false,
              bank_name: original.bank_name,
              card_name: original.card_name,
              card_holder: original.card_holder,
            },
          });
          generatedCount++;
        }
      }
    }

    // 2. Find recurring transactions
    const recurringGroups = await prisma.transaction.groupBy({
      by: ['description'],
      where: { is_forecast: false },
      _count: { id: true },
      _avg: { amount: true },
      _max: { date_incurred: true },
      having: {
        id: { _count: { gte: 2 } },
      },
    });

    for (const group of recurringGroups) {
      const lastDate = new Date(group._max.date_incurred!);
      const nextDate = new Date(lastDate);
      nextDate.setMonth(nextDate.getMonth() + 1);

      if (nextDate > new Date()) {
        const existing = await prisma.transaction.findFirst({
          where: {
            description: group.description,
            date_incurred: { gte: nextDate },
            is_forecast: true,
          },
        });

        if (!existing) {
          const original = await prisma.transaction.findFirst({
            where: { description: group.description },
          });

          if (original) {
            await prisma.transaction.create({
              data: {
                date_incurred: nextDate,
                date_payment: nextDate,
                description: group.description,
                amount: group._avg.amount || 0,
                currency: 'BRL',
                category: original.category,
                behavior_class: original.behavior_class,
                installment_current: 1,
                installment_total: 1,
                source_file: 'forecast_recurring',
                is_verified: false,
                is_auto_generated: true,
                is_forecast: true,
                forecast_paid: false,
              },
            });
            generatedCount++;
          }
        }
      }
    }

    return NextResponse.json({ success: true, generatedCount });
  } catch (error: any) {
    console.error('Generate forecasts error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate forecasts' },
      { status: 500 }
    );
  }
}
