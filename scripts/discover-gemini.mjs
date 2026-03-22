import { readFileSync } from "fs";

const envContent = readFileSync(".env.local", "utf8");
const apiKey = envContent.match(/^GEMINI_API_KEY=(.*)$/m)[1].trim().replace(/['"]/g, "");

async function discover() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.models) {
            console.log("--- AVAILABLE MODELS ---");
            data.models.forEach(m => console.log(m.name));
            console.log("------------------------");
        } else {
            console.error("❌ No models found or error:", data);
        }
    } catch (e) {
        console.error("❌ Discovery failed:", e.message);
    }
}

discover();
