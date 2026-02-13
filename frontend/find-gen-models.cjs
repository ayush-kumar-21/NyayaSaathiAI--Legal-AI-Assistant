
const fs = require('fs');
let apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    try {
        const envContent = fs.readFileSync('.env', 'utf-8');
        const match = envContent.match(/GEMINI_API_KEY=(.*)/);
        if (match) apiKey = match[1].trim();
    } catch (e) {
        console.error("Error reading .env:", e.message);
    }
}

if (!apiKey) { console.error("No Key found even in .env"); process.exit(1); }

async function check() {
    try {
        const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await resp.json();
        if (data.error) {
            console.error(data.error);
            return;
        }
        console.log("Models supporting generateContent:");
        const genModels = (data.models || []).filter(m => m.supportedGenerationMethods.includes("generateContent"));
        genModels.forEach(m => console.log(`- ${m.name} (${m.displayName})`));
    } catch (e) {
        console.error(e);
    }
}
check();
