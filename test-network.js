const https = require('https');

const testSupabaseConnection = () => {
    const options = {
        hostname: 'db.zqrekxkvxrltnwzptsbx.supabase.co',
        port: 6543,
        path: '/',
        method: 'GET',
        timeout: 5000
    };

    console.log('Testando conexão TCP com Supabase (porta 6543)...');

    const req = https.request(options, (res) => {
        console.log(`✅ Conexão estabelecida! Status: ${res.statusCode}`);
        console.log('O Supabase está acessível da sua rede.');
    });

    req.on('error', (error) => {
        console.error('❌ Erro de conexão:', error.message);
        console.error('\nPossíveis causas:');
        console.error('1. Firewall/Antivírus bloqueando a porta 6543');
        console.error('2. Proxy corporativo bloqueando');
        console.error('3. ISP bloqueando conexões PostgreSQL');
        console.error('4. Supabase realmente pausado/offline');
    });

    req.on('timeout', () => {
        console.error('❌ Timeout: Não conseguiu conectar em 5 segundos');
        req.destroy();
    });

    req.end();
};

testSupabaseConnection();
