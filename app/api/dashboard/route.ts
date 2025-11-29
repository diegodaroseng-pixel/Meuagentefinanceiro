import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check if user has any transactions at all (for welcome screen)
        const totalCount = await prisma.transaction.count({
            where: { userId }
        });

        // Get filter parameters
        const searchParams = request.nextUrl.searchParams;
        const month = searchParams.get('month');
        const year = searchParams.get('year');

        // Build where clause
        const where: any = {
            userId,
            // Removed is_forecast: false to include future installments
        };

        // Add date filtering if month/year provided
        if (month || year) {
            const startDate = new Date();
            const endDate = new Date();

            if (year && month) {
                // Specific month and year
                startDate.setFullYear(parseInt(year), parseInt(month) - 1, 1);
                endDate.setFullYear(parseInt(year), parseInt(month), 0);
            } else if (year) {
                // Entire year
                startDate.setFullYear(parseInt(year), 0, 1);
                endDate.setFullYear(parseInt(year), 11, 31);
            } else if (month) {
                // Specific month in current year
                const currentYear = new Date().getFullYear();
                startDate.setFullYear(currentYear, parseInt(month) - 1, 1);
                endDate.setFullYear(currentYear, parseInt(month), 0);
            }

            where.date_incurred = {
                gte: startDate,
                lte: endDate,
            };
        }

        const transactions = await prisma.transaction.findMany({
            where,
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
                essentials: essentialsSpent,
            },
            byCategory: categoryData,
            byType: behaviorData,
            byMonth: monthlyData,
            hasTransactions: totalCount > 0
        });
    } catch (error: any) {
        console.error('Dashboard error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch dashboard data' },
            { status: 500 }
        );
    }
}
