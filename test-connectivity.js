// Test 1: Check if Supabase is accessible via REST API
async function testSupabaseREST() {
    console.log("=== TEST 1: Supabase REST API ===");
    const url = "https://zqrekxkvxrltnwzptsbx.supabase.co/rest/v1/";

    try {
        const response = await fetch(url);
        console.log("✅ Supabase REST API is accessible");
        console.log("Status:", response.status);
    } catch (error) {
        console.error("❌ Cannot reach Supabase REST API:", error.message);
    }
}

// Test 2: Check if PostgreSQL port is accessible
async function testPostgresPort() {
    console.log("\n=== TEST 2: PostgreSQL Port (5432) ===");
    const net = require('net');

    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(5000);

        socket.on('connect', () => {
            console.log("✅ Port 5432 is accessible");
            socket.destroy();
            resolve(true);
        });

        socket.on('timeout', () => {
            console.error("❌ Timeout connecting to port 5432");
            socket.destroy();
            resolve(false);
        });

        socket.on('error', (err) => {
            console.error("❌ Cannot connect to port 5432:", err.message);
            resolve(false);
        });

        socket.connect(5432, 'db.zqrekxkvxrltnwzptsbx.supabase.co');
    });
}

// Test 3: Check PgBouncer port
async function testPgBouncerPort() {
    console.log("\n=== TEST 3: PgBouncer Port (6543) ===");
    const net = require('net');

    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(5000);

        socket.on('connect', () => {
            console.log("✅ Port 6543 is accessible");
            socket.destroy();
            resolve(true);
        });

        socket.on('timeout', () => {
            console.error("❌ Timeout connecting to port 6543");
            socket.destroy();
            resolve(false);
        });

        socket.on('error', (err) => {
            console.error("❌ Cannot connect to port 6543:", err.message);
            resolve(false);
        });

        socket.connect(6543, 'db.zqrekxkvxrltnwzptsbx.supabase.co');
    });
}

// Run all tests
async function runAllTests() {
    await testSupabaseREST();
    await testPostgresPort();
    await testPgBouncerPort();

    console.log("\n=== SUMMARY ===");
    console.log("If all tests pass, the issue is with Prisma configuration or Vercel environment.");
    console.log("If ports fail, it's a firewall/network issue on your machine.");
    console.log("If only Vercel fails, check Vercel environment variables and Supabase IP restrictions.");
}

runAllTests();
