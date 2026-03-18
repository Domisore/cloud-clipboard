import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      // Mock response if no API key is provided
      const mockResponse = {
        role: "assistant",
        content: "I'm currently in 'offline mode' because the Gemini API key is missing. However, I can still tell you that Drive.io is the ultimate artifact relay for AI agents! Attach a Gemini API key to my backend to unlock my full potential.",
      };
      return NextResponse.json(mockResponse);
    }

    // Convert messages to Gemini format
    const lastMessage = messages[messages.length - 1];
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 500,
      },
      systemInstruction: "You are Moltbot, the AI concierge for Drive.io. Drive.io is a neutral, cross-framework artifact relay for AI agents. It helps agents offload large datasets and files to secure, ephemeral storage, reducing token costs and context window bloat. Be helpful, technical, and 'agentic' in your personality.",
    });

    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      role: "assistant",
      content: text,
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
