import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                is_forecast: false,
            },
        });

        // Calculate metrics
        const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
        const transactionCount = transactions.length;
        const avgTransaction = transactionCount > 0 ? totalSpent / transactionCount : 0;
        const essentialsSpent = transactions
            .filter(t => t.behavior_class === 'Essencial')
            .reduce((sum, t) => sum + t.amount, 0);

        // Group by category
        const byCategory = transactions.reduce((acc: any, t) => {
            const cat = t.category || 'Outros';
            acc[cat] = (acc[cat] || 0) + t.amount;
            return acc;
        }, {});

        const categoryData = Object.entries(byCategory).map(([name, value]) => ({
            name,
            value,
        }));

        // Group by behavior class
        const byBehavior = transactions.reduce((acc: any, t) => {
            const behavior = t.behavior_class || 'Não classificado';
            acc[behavior] = (acc[behavior] || 0) + t.amount;
            return acc;
        }, {});

        const behaviorData = Object.entries(byBehavior).map(([name, value]) => ({
            name,
            value,
        }));

        // Group by month
        const byMonth = transactions.reduce((acc: any, t) => {
            const date = new Date(t.date_incurred);
            const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            acc[month] = (acc[month] || 0) + t.amount;
            return acc;
        }, {});

        const monthlyData = Object.entries(byMonth)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([month, value]) => ({
                month,
                value,
            }));

        return NextResponse.json({
            metrics: {
                totalSpent,
                transactionCount,
                avgTransaction,
                essentialsSpent,
            },
            categoryData,
            behaviorData,
            monthlyData,
        });
    } catch (error: any) {
        console.error('Dashboard error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch dashboard data' },
            { status: 500 }
        );
    }
}
