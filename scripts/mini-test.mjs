import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from "fs";

const envContent = readFileSync(".env.local", "utf8");
const apiKey = envContent.match(/^GEMINI_API_KEY=(.*)$/m)[1].trim().replace(/['"]/g, "");

async function run() {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Say hello in one word.");
    console.log("Response:", result.response.text());
}

run().catch(console.error);
