import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from "fs";
import { join } from "path";

// 1. Load GEMINI_API_KEY from .env.local
let apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    try {
        const envContent = readFileSync(".env.local", "utf8");
        const match = envContent.match(/^GEMINI_API_KEY=(.*)$/m);
        if (match) {
            apiKey = match[1].trim().replace(/['"]/g, "");
            console.log("✅ Loaded GEMINI_API_KEY from .env.local");
        }
    } catch (e) {
        console.error("❌ Could not read .env.local");
    }
}

async function testGemini() {
    if (!apiKey) {
        console.error("❌ No GEMINI_API_KEY found. Please add it to .env.local first.");
        return;
    }

    console.log("🚀 Testing Gemini Summarization...");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
    });

    const testContent = `
    # Project: Drive.io
    Drive.io is a high-performance artifact relay for AI agents. 
    It solves the context window problem by replacing large payloads with 7-token pointer URLs.
    It supports tiered retrieval (L0, L1, L2) to allow agents to fetch only the necessary abstraction level.
    `;

    const prompt = `You are a technical context-relay agent. Process this payload and provide two levels of abstraction: 
    L0: one-sentence abstract (~100 tokens)
    L1: technical overview/schema (~2000 tokens)
    
    Return JSON: {"L0": "...", "L1": "..."}
    
    PAYLOAD: ${testContent}`;

    try {
        const result = await model.generateContent(prompt);
        const response = JSON.parse(result.response.text());
        
        console.log("\n--- GEMINI RESPONSE ---");
        console.log("L0 (Abstract):", response.L0);
        console.log("\nL1 (Overview):", response.L1);
        console.log("------------------------\n");
        console.log("✅ Gemini integration is WORKING perfectly.");
    } catch (error) {
        console.error("❌ Gemini integration FAILED:", error.message);
    }
}

testGemini();
