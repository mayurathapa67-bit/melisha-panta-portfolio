import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  SESSION_SECRET,
  verifyPassword,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let password = "";
  try {
    const body = (await request.json()) as { password?: string };
    password = body.password ?? "";
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400, headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }

  if (!verifyPassword(password)) {
    return NextResponse.json(
      { ok: false, error: "Incorrect password." },
      { status: 401, headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }

  const response = NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
  response.cookies.set(AUTH_COOKIE_NAME, SESSION_SECRET, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
  response.cookies.delete(AUTH_COOKIE_NAME);
  return response;
}
