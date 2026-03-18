import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("Chat API: Processing request...");
    const { messages } = await req.json();
    console.log("Chat API: Messages received:", messages.length);

    if (!process.env.GEMINI_API_KEY) {
      console.warn("Chat API: Missing GEMINI_API_KEY");
      // Mock response if no API key is provided
      const mockResponse = {
        role: "assistant",
        content: "I'm currently in 'offline mode' because the Gemini API key is missing. However, I can still tell you that Drive.io is the ultimate artifact relay for AI agents! Attach a Gemini API key to my backend to unlock my full potential.",
      };
      return NextResponse.json(mockResponse);
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: "You are Moltbot, the AI concierge for Drive.io. Drive.io is a neutral, cross-framework artifact relay for AI agents. It helps agents offload large datasets and files to secure, ephemeral storage, reducing token costs and context window bloat. Be helpful, technical, and 'agentic' in your personality."
    });

    // Convert messages to Gemini format
    const lastMessage = messages[messages.length - 1];
    let history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content || "" }],
    }));

    // CRITICAL: Gemini requires the first message in history to be from 'user'.
    // If our history starts with the initial "assistant" welcome message, we must remove it.
    while (history.length > 0 && history[0].role === "model") {
      history.shift();
    }

    console.log("Chat API: History prepared, starting chat...");

    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;
    const text = response.text();

    console.log("Chat API: Response generated successfully");

    return NextResponse.json({
      role: "assistant",
      content: text,
    });
  } catch (error: any) {
    console.error("Chat API error details:", {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
