import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from "fs";

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

async function listModels() {
    if (!apiKey) {
        console.error("❌ No GEMINI_API_KEY found.");
        return;
    }

    // GoogleGenerativeAI doesn't have listModels directly in some SDK versions, 
    // it's usually via a separate discovery API, but let's try common models one by one.
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const commonModels = ["gemini-pro", "gemini-1.5-flash", "gemini-1.5-pro"];

    console.log("🚀 Testing common models...\n");

    for (const modelName of commonModels) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            console.log(`Testing ${modelName}...`);
            const result = await model.generateContent("echo hi");
            console.log(`✅ ${modelName} is working!`);
            process.exit(0);
        } catch (e) {
            console.log(`❌ ${modelName} failed: ${e.message.split('\n')[0]}`);
        }
    }
}

listModels();
