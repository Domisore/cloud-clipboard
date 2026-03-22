import { readFileSync } from "fs";

const envContent = readFileSync(".env.local", "utf8");
const apiKey = envContent.match(/^GEMINI_API_KEY=(.*)$/m)[1].trim().replace(/['"]/g, "");

async function discover() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const flashModels = (data.models || []).filter(m => m.name.includes("flash")).map(m => m.name);
        console.log("FLASH MODELS:", flashModels);
        
        const proModels = (data.models || []).filter(m => m.name.includes("pro")).map(m => m.name);
        console.log("PRO MODELS:", proModels);
    } catch (e) {
        console.error("❌ Discovery failed:", e.message);
    }
}

discover();
