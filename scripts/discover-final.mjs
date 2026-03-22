import { readFileSync } from "fs";

const envContent = readFileSync(".env.local", "utf8");
const apiKey = envContent.match(/^GEMINI_API_KEY=(.*)$/m)[1].trim().replace(/['"]/g, "");

async function discover() {
    console.log(`Using API Key starting with: ${apiKey.substring(0, 5)}...`);
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`❌ HTTP Error: ${response.status} ${response.statusText}`);
            const errorBody = await response.text();
            console.error(`Error Body: ${errorBody}`);
            return;
        }
        const data = await response.json();
        if (data.models && data.models.length > 0) {
            console.log("--- AVAILABLE MODELS ---");
            data.models.forEach(m => console.log(m.name));
            console.log("------------------------");
        } else {
            console.error("❌ No models found in the response JSON.");
            console.log("Full JSON:", JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error("❌ Discovery failed:", e.message);
    }
}

discover();
