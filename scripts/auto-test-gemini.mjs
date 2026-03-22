import { readFileSync } from "fs";

const envContent = readFileSync(".env.local", "utf8");
const apiKey = envContent.match(/^GEMINI_API_KEY=(.*)$/m)[1].trim().replace(/['"]/g, "");

async function autoTest() {
    console.log("🚀 Starting Auto-Discovery and Test...");
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    try {
        const listResponse = await fetch(listUrl);
        const listData = await listResponse.json();
        
        if (!listData.models || listData.models.length === 0) {
            console.error("❌ No models found during discovery.");
            return;
        }

        // Filter for text-generation models
        const textModels = listData.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
        console.log(`Found ${textModels.length} text models.`);

        for (const model of textModels) {
            console.log(`\nTesting ${model.name}...`);
            const genUrl = `https://generativelanguage.googleapis.com/v1beta/${model.name}:generateContent?key=${apiKey}`;
            const body = { contents: [{ parts: [{ text: "hi" }] }] };
            
            const genResponse = await fetch(genUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            if (genResponse.ok) {
                const data = await genResponse.json();
                console.log(`✅ SUCCESS! ${model.name} is functional.`);
                console.log("Response:", data.candidates[0].content.parts[0].text);
                process.exit(0);
            } else {
                const err = await genResponse.json();
                console.log(`❌ FAILED: ${model.name} (${genResponse.status}): ${err.error?.message || "Unknown error"}`);
            }
        }
    } catch (e) {
        console.error("❌ Auto-test crashed:", e.message);
    }
}

autoTest();
