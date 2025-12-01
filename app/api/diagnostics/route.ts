import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET() {
    const diagnostics = {
        timestamp: new Date().toISOString(),
        environment: 'vercel',
        tests: [] as any[],
    };

    // Test 1: Check environment variables
    diagnostics.tests.push({
        name: 'Environment Variables',
        DATABASE_URL_exists: !!process.env.DATABASE_URL,
        DATABASE_URL_preview: process.env.DATABASE_URL?.substring(0, 30) + '...',
        DIRECT_URL_exists: !!process.env.DIRECT_URL,
        GOOGLE_API_KEY_exists: !!process.env.GOOGLE_API_KEY,
    });

    // Test 2: Try to create Prisma client
    let prisma: PrismaClient | null = null;
    try {
        prisma = new PrismaClient();
        diagnostics.tests.push({
            name: 'Prisma Client Creation',
            status: 'success',
        });
    } catch (error: any) {
        diagnostics.tests.push({
            name: 'Prisma Client Creation',
            status: 'failed',
            error: error.message,
        });
        return NextResponse.json(diagnostics, { status: 500 });
    }

    // Test 3: Try to connect to database
    try {
        await prisma.$connect();
        diagnostics.tests.push({
            name: 'Database Connection',
            status: 'success',
        });
    } catch (error: any) {
        diagnostics.tests.push({
            name: 'Database Connection',
            status: 'failed',
            error: error.message,
            code: error.code,
        });
        await prisma.$disconnect();
        return NextResponse.json(diagnostics, { status: 500 });
    }

    // Test 4: Try a simple query
    try {
        const result = await prisma.$queryRaw`SELECT 1 as test`;
        diagnostics.tests.push({
            name: 'Simple Query',
            status: 'success',
            result,
        });
    } catch (error: any) {
        diagnostics.tests.push({
            name: 'Simple Query',
            status: 'failed',
            error: error.message,
        });
    }

    // Test 5: Try to query transactions table
    try {
        const count = await prisma.transaction.count();
        diagnostics.tests.push({
            name: 'Transaction Table Query',
            status: 'success',
            count,
        });
    } catch (error: any) {
        diagnostics.tests.push({
            name: 'Transaction Table Query',
            status: 'failed',
            error: error.message,
        });
    }

    await prisma.$disconnect();

    return NextResponse.json(diagnostics);
}
