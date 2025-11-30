const fs = require('fs');
const path = require('path');

async function checkModels() {
    let apiKey = '';
    try {
        const envPath = path.join(__dirname, '.env.local');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/GOOGLE_API_KEY=(.*)/);
        if (match) {
            apiKey = match[1].trim();
        }
    } catch (e) {
        console.log("Could not read .env.local");
    }

    if (!apiKey) {
        console.log("No API KEY found");
        return;
    }

    console.log("Checking available models for key ending in:", apiKey.slice(-4));

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", data.error.message);
        } else if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => console.log(`- ${m.name}`));
        } else {
            console.log("No models found or unexpected response:", data);
        }
    } catch (error) {
        console.error("Network error:", error.message);
    }
}

checkModels();
