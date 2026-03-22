import { readFileSync } from "fs";

const envContent = readFileSync(".env.local", "utf8");
const apiKey = envContent.match(/^GEMINI_API_KEY=(.*)$/m)[1].trim().replace(/['"]/g, "");

async function testDirect() {
    console.log("🚀 Running direct fetch test...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const body = {
        contents: [{
            parts: [{ text: "echo ok" }]
        }]
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            console.error(`❌ HTTP Error: ${response.status} ${response.statusText}`);
            console.error(await response.text());
            return;
        }

        const data = await response.json();
        console.log("✅ Success! Response:", data.candidates[0].content.parts[0].text);
    } catch (e) {
        console.error("❌ Direct fetch failed:", e.message);
    }
}

testDirect();
