import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface Tiers {
    L0: string; // ~100 tokens Summary
    L1: string; // ~2000 tokens Overview
    L2: string; // Full content
}

export async function generateTiers(content: string, contentType: string = "text/plain"): Promise<Tiers> {
    const L2 = content;
    
    try {
        // Generate L0 (Abstract) and L1 (Overview) in a single structured call if possible, 
        // or sequential for reliability.
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Cost-effective for summarization
            messages: [
                {
                    role: "system",
                    content: "You are a technical context-relay agent. Your job is to process a payload and provide two levels of abstraction: L0 (a one-sentence abstract, ~100 tokens max) and L1 (a technical overview including schemas, core insights, or code structures, ~2000 tokens max). Return your response in JSON format."
                },
                {
                    role: "user",
                    content: `CONTENT TYPE: ${contentType}\n\nPAYLOAD:\n${content.substring(0, 100000)}` // Safeguard content size
                }
            ],
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(response.choices[0].message.content || "{}");
        
        return {
            L0: result.L0 || result.abstract || "Summary unavailable.",
            L1: result.L1 || result.overview || "Overview unavailable.",
            L2: L2
        };
    } catch (error) {
        console.error("[SUMMARIZER_ERROR] Failed to generate tiers:", error);
        return {
            L0: "Error generating abstract.",
            L1: "Error generating overview.",
            L2: L2
        };
    }
}
