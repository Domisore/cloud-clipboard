import { readFileSync } from "fs";

const envContent = readFileSync(".env.local", "utf8");
const apiKey = envContent.match(/^GEMINI_API_KEY=(.*)$/m)[1].trim().replace(/['"]/g, "");

async function tryCombo(version, model) {
    const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`;
    const body = { contents: [{ parts: [{ text: "hi" }] }] };
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        
        if (response.ok) {
            console.log(`✅ SUCCESS: ${version} + ${model}`);
            return true;
        } else {
            const err = await response.json();
            console.log(`❌ FAIL: ${version} + ${model} (${response.status}): ${err.error?.message || "Unknown error"}`);
            return false;
        }
    } catch (e) {
        console.log(`❌ ERROR: ${version} + ${model}: ${e.message}`);
        return false;
    }
}

async function runAll() {
    await tryCombo("v1", "gemini-pro");
    await tryCombo("v1", "gemini-1.5-flash");
    await tryCombo("v1beta", "gemini-pro");
    await tryCombo("v1beta", "gemini-1.5-flash");
}

runAll();
