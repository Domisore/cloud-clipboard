import { readFileSync, writeFileSync } from "fs";

const envContent = readFileSync(".env.local", "utf8");
const apiKey = envContent.match(/^GEMINI_API_KEY=(.*)$/m)[1].trim().replace(/['"]/g, "");

async function discover() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.models) {
            const list = data.models.map(m => m.name).join("\n");
            writeFileSync("gemini_models.txt", list);
            console.log("✅ Models saved to gemini_models.txt");
        } else {
            console.error("❌ No models found or error:", data);
        }
    } catch (e) {
        console.error("❌ Discovery failed:", e.message);
    }
}

discover();
