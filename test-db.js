const { PrismaClient } = require('@prisma/client');

async function testConnection() {
    const prisma = new PrismaClient({
        log: ['query', 'error', 'warn'],
    });

    try {
        console.log('Tentando conectar ao banco...');
        const result = await prisma.$queryRaw`SELECT 1 as test`;
        console.log('✅ Conexão bem-sucedida!', result);
    } catch (error) {
        console.error('❌ Erro de conexão:', error.message);
        console.error('Detalhes:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
