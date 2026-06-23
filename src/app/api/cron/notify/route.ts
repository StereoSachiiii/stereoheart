import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY || "");

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Get due reviews
  const { data: reviews, error } = await supabaseAdmin
    .from("reviews")
    .select("*")
    .lte("due_at", new Date().toISOString())
    .eq("status", "pending");

  if (error) {
    return new NextResponse(error.message, { status: 500 });
  }

  if (!reviews || reviews.length === 0) {
    return new NextResponse("No reviews due", { status: 200 });
  }

  const topicList = reviews.map((r: any) => `- ${r.topic_name} (Review #${r.review_number})`).join("\n");

  try {
    await resend.emails.send({
      from: "Stereoheart <onboarding@resend.dev>",
      to: "me@example.com", // Adjust as needed
      subject: "Stereoheart: Reviews Due Today",
      text: `You have ${reviews.length} reviews due today:\n\n${topicList}\n\nGet to work.`,
    });
    return new NextResponse("OK", { status: 200 });
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
}
