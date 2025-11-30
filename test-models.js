const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

async function listModels() {
    let apiKey = '';
    try {
        const envPath = path.join(__dirname, '.env.local');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/GOOGLE_API_KEY=(.*)/);
        if (match) {
            apiKey = match[1].trim();
        }
    } catch (e) {
        console.log("Could not read .env.local", e.message);
    }

    if (!apiKey) {
        console.log("No API KEY found");
        return;
    }

    console.log("Using API Key ending in:", apiKey.slice(-4));

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        console.log("Testing gemini-1.5-flash...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello");
        console.log("Success with gemini-1.5-flash!");
        console.log(result.response.text());
    } catch (error) {
        console.error("Error with gemini-1.5-flash:", error.message);
    }

    try {
        console.log("\nTesting gemini-pro...");
        const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
        const resultPro = await modelPro.generateContent("Hello");
        console.log("Success with gemini-pro!");
        console.log(resultPro.response.text());
    } catch (error) {
        console.error("Error with gemini-pro:", error.message);
    }
}

listModels();
