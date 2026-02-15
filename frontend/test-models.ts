
import { GoogleGenAI } from "@google/genai";
import * as dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    console.error("No API KEY found");
    process.exit(1);
}

const client = new GoogleGenAI({ apiKey });

async function listModels() {
    try {
        console.log("Checking available models...");
        // The new SDK structure for listing models might differ. 
        // Adapting to standard REST or SDK method if available. 
        // Since @google/genai is new and in beta/alpha, we'll try the models.list() if it exists 
        // or just try a simple generateContent on a known model to verify connectivity.

        // Actually, let's just try to hit 'gemini-1.5-flash' and 'gemini-1.0-pro' and see specifically what happens.
        // Listing might not be exposed easily in the helper surface of the new SDK yet without digging into types.

        const models = ['gemini-1.5-flash', 'gemini-1.5-flash-001', 'gemini-1.5-flash-002', 'gemini-1.5-pro', 'gemini-1.0-pro'];

        for (const model of models) {
            console.log(`\nTesting ${model}...`);
            try {
                const response = await client.models.generateContent({
                    model: model,
                    contents: "Hello, are you there?",
                });
                console.log(`✅ ${model} SUCCESS:`, response.text ? "Has text" : "No text");
            } catch (e) {
                console.log(`❌ ${model} FAILED:`, e.message?.substring(0, 100));
            }
        }
    } catch (error) {
        console.error("Script Error:", error);
    }
}

listModels();
