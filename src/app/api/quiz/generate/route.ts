import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const { topic, detail } = await req.json();

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 1024,
      system: "You are a harsh C++ systems engineering interviewer. Generate a challenging C++ code snippet question for the given topic. The output should be ONLY the markdown code snippet and a 1-sentence question below it. No greetings or pleasantries.",
      messages: [
        { role: "user", content: `Topic: ${topic}\nDetail: ${detail}` }
      ]
    });

    const content = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ question: content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
