import { NextRequest, NextResponse } from "next/server";
import { deleteSubmission, readSubmissions } from "@/lib/submissions";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

function noStore(): Record<string, string> {
  return { "Cache-Control": "no-store, max-age=0" };
}

export async function GET() {
  const authed = await getSession();
  if (!authed) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401, headers: noStore() }
    );
  }
  const submissions = readSubmissions();
  return NextResponse.json(
    { ok: true, submissions },
    { headers: noStore() }
  );
}

export async function DELETE(request: NextRequest) {
  const authed = await getSession();
  if (!authed) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401, headers: noStore() }
    );
  }
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { ok: false, error: "Missing id." },
      { status: 400, headers: noStore() }
    );
  }
  const removed = deleteSubmission(id);
  if (!removed) {
    return NextResponse.json(
      { ok: false, error: "Submission not found." },
      { status: 404, headers: noStore() }
    );
  }
  return NextResponse.json({ ok: true }, { headers: noStore() });
}
