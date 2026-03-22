import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

function getOpenAIClient() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return null;
    return new OpenAI({ apiKey });
}

function getGeminiClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenerativeAI(apiKey);
}

export interface Tiers {
    L0: string; // ~100 tokens Summary
    L1: string; // ~2000 tokens Overview
    L2: string; // Full content
}

export async function generateTiers(content: string, contentType: string = "text/plain"): Promise<Tiers> {
    const L2 = content;
    
    // 1. Try Gemini (User Preferred)
    const gemini = getGeminiClient();
    if (gemini) {
        try {
            // Using the precise model name identified in discovery
            const model = gemini.getGenerativeModel({ 
                model: "models/gemini-1.5-flash"
            }, { apiVersion: 'v1beta' }); // Force v1beta which worked in discovery
            
            const prompt = `You are a technical context-relay agent. Process this payload and provide two levels of abstraction: 
            L0: one-sentence abstract (~100 tokens max)
            L1: technical overview/schema (~2000 tokens max)
            
            Return ONLY a valid JSON object: {"L0": "...", "L1": "..."}
            
            CONTENT TYPE: ${contentType}
            PAYLOAD: ${content.substring(0, 50000)}`;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text().trim();
            // Clean markdown code blocks if present
            const cleanJson = responseText.replace(/^```json\n?|\n?```$/g, '');
            const response = JSON.parse(cleanJson);
            
            return {
                L0: response.L0 || "Summary unavailable.",
                L1: response.L1 || "Overview unavailable.",
                L2
            };
        } catch (error) {
            console.error("[GEMINI_ERROR]", error);
        }
    }

    // 2. Fallback to OpenAI
    const openai = getOpenAIClient();
    if (openai) {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are a technical context-relay agent. Provide L0 (abstract) and L1 (overview) in JSON format: {\"L0\": \"...\", \"L1\": \"...\"}"
                    },
                    {
                        role: "user",
                        content: `CONTENT TYPE: ${contentType}\n\nPAYLOAD:\n${content.substring(0, 50000)}`
                    }
                ],
                response_format: { type: "json_object" }
            });

            const result = JSON.parse(response.choices[0].message.content || "{}");
            return {
                L0: result.L0 || "Summary unavailable.",
                L1: result.L1 || "Overview unavailable.",
                L2
            };
        } catch (error) {
            console.error("[OPENAI_ERROR]", error);
        }
    }

    // 3. Final Fallback
    return {
        L0: "Summary unavailable (No LLM key configured).",
        L1: "Overview unavailable (No LLM key configured).",
        L2: L2
    };
}
