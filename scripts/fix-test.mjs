import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from "fs";

const envContent = readFileSync(".env.local", "utf8");
const apiKey = envContent.match(/^GEMINI_API_KEY=(.*)$/m)[1].trim().replace(/['"]/g, "");

async function testGemini() {
    console.log("🚀 Running fix test with models/ prefix...");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
        model: "models/gemini-1.5-flash"
    }, { apiVersion: 'v1beta' });

    try {
        const result = await model.generateContent("echo ok");
        console.log("✅ Success! Response:", result.response.text());
    } catch (e) {
        console.error("❌ Failed with models/ prefix:", e.message);
    }
}

testGemini();
