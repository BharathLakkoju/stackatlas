import { NextRequest, NextResponse } from "next/server";
import { reportError } from "@/lib/report-error";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { email?: string };
  const email = body.email?.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return NextResponse.json({ ok: true, local: true });
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.NEWSLETTER_FROM ?? "StackAtlas <digest@stackatlas.dev>",
        to: email,
        subject: "You’re on the StackAtlas weekly digest",
        text: "You will get new lessons, daily explainers, and labs once a week.",
      }),
    });
    if (!res.ok) throw new Error(await res.text());
    return NextResponse.json({ ok: true });
  } catch (error) {
    reportError(error, "newsletter");
    return NextResponse.json({ error: "Could not subscribe" }, { status: 502 });
  }
}
