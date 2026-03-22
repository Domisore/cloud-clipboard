import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from "fs";

// 1. Load GEMINI_API_KEY from .env.local
let apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    const envContent = readFileSync(".env.local", "utf8");
    apiKey = envContent.match(/^GEMINI_API_KEY=(.*)$/m)[1].trim().replace(/['"]/g, "");
}

async function testGemini() {
    console.log("🚀 Running production-grade Gemini test...");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash"
    }, { apiVersion: 'v1beta' });

    const prompt = `You are a technical context-relay agent. Process this payload and provide two levels of abstraction: 
    L0: one-sentence abstract (~100 tokens max)
    L1: technical overview/schema (~2000 tokens max)
    
    Return ONLY a valid JSON object: {"L0": "...", "L1": "..."}
    
    PAYLOAD: Drive.io is a context-relay for agents.`;

    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();
        const cleanJson = responseText.replace(/^```json\n?|\n?```$/g, '');
        const response = JSON.parse(cleanJson);
        
        console.log("✅ Success! L0:", response.L0);
    } catch (e) {
        console.error("❌ Failed:", e.message);
    }
}

testGemini();
