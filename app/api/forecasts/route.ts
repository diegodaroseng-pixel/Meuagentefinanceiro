import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

// GET - List all forecasts
export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const forecasts = await prisma.transaction.findMany({
            where: { userId, is_forecast: true },
            orderBy: { date_incurred: 'asc' },
        });
        return NextResponse.json({ forecasts });
    } catch (error: any) {
        console.error('Get forecasts error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch forecasts' },
            { status: 500 }
        );
    }
}

// PUT - Mark forecast as paid
export async function PUT(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, paid, amount } = body;

        await prisma.transaction.update({
            where: { id, userId },
            data: {
                forecast_paid: paid,
                amount,
                is_verified: true,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Update forecast error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update forecast' },
            { status: 500 }
        );
    }
}
