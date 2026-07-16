import { NextRequest, NextResponse } from "next/server";
import { addSubmission } from "@/lib/submissions";

export const dynamic = "force-dynamic";

function noStore(): Record<string, string> {
  return { "Cache-Control": "no-store, max-age=0" };
}

export async function POST(request: NextRequest) {
  let payload: {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400, headers: noStore() }
    );
  }

  const name = (payload.name ?? "").trim();
  const email = (payload.email ?? "").trim();
  const subject = (payload.subject ?? "").trim();
  const message = (payload.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "Name, email, and message are required." },
      { status: 400, headers: noStore() }
    );
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    return NextResponse.json(
      { ok: false, error: "Please provide a valid email address." },
      { status: 400, headers: noStore() }
    );
  }

  addSubmission({
    name,
    email,
    subject: subject || "General enquiry",
    message,
  });

  return NextResponse.json({ ok: true }, { headers: noStore() });
}
