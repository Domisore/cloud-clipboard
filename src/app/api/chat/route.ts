import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      // Mock response if no API key is provided
      const mockResponse = {
        role: "assistant",
        content: "I'm currently in 'offline mode' because the OpenAI API key is missing. However, I can still tell you that Drive.io is the ultimate artifact relay for AI agents! Attach an API key to my backend to unlock my full potential.",
      };
      return NextResponse.json(mockResponse);
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: false, // Set to true for streaming, but keeping it simple for now
      messages: [
        {
          role: "system",
          content: "You are Moltbot, the AI concierge for Drive.io. Drive.io is a neutral, cross-framework artifact relay for AI agents. It helps agents offload large datasets and files to secure, ephemeral storage, reducing token costs and context window bloat. Be helpful, technical, and 'agentic' in your personality.",
        },
        ...messages,
      ],
    });

    return NextResponse.json(response.choices[0].message);
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
