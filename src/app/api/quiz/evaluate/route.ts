import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const { question, answer } = await req.json();

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 1024,
      system: "You are a harsh, direct C++ systems engineering interviewer. Evaluate the student's answer to the question. Give harsh, direct feedback in MAXIMUM 4 sentences. Point out undefined behavior, memory leaks, or suboptimal cache usage if applicable.",
      messages: [
        { role: "user", content: `Question: ${question}\n\nStudent Answer: ${answer}` }
      ]
    });

    const content = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ feedback: content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
