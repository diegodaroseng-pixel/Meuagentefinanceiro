const { PrismaClient } = require('@prisma/client');

const connectionString = "postgresql://postgres:meuagentefinanceirodiego@db.zqrekxkvxrltnwzptsbx.supabase.co:5432/postgres";

async function testConnection() {
    console.log("Testando conexão com Supabase...");
    console.log("URL:", connectionString.replace(/:[^:]*@/, ':****@')); // Hide password in logs

    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: connectionString,
            },
        },
    });

    try {
        const result = await prisma.$queryRaw`SELECT 1 as result`;
        console.log("✅ SUCESSO! Conexão estabelecida com o Supabase.");
        console.log("Resultado:", result);
    } catch (e) {
        console.error("❌ ERRO ao conectar:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
