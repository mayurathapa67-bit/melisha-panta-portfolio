import { NextRequest, NextResponse } from "next/server";
import { getContent } from "@/lib/content";
import { updateContentFile, isGitHubConfigured } from "@/lib/github";
import { getSession } from "@/lib/auth";
import fs from "fs";
import path from "path";
import type { SiteContent } from "@/lib/types";

export const dynamic = "force-dynamic";

function noStore(): Record<string, string> {
  return { "Cache-Control": "no-store, max-age=0" };
}

export async function GET() {
  const content = await getContent();
  return NextResponse.json(
    { ok: true, content, githubConfigured: isGitHubConfigured() },
    { headers: noStore() }
  );
}

export async function PUT(request: NextRequest) {
  const authed = await getSession();
  if (!authed) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401, headers: noStore() }
    );
  }

  let payload: { content?: SiteContent };
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400, headers: noStore() }
    );
  }

  if (!payload.content || typeof payload.content !== "object") {
    return NextResponse.json(
      { ok: false, error: "Content is required." },
      { status: 400, headers: noStore() }
    );
  }

  if (isGitHubConfigured()) {
    const result = await updateContentFile(payload.content);
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error ?? "GitHub update failed." },
        { status: 500, headers: noStore() }
      );
    }
    return NextResponse.json(
      { ok: true, target: "github" },
      { headers: noStore() }
    );
  }

  try {
    const filePath = path.join(process.cwd(), "content.json");
    fs.writeFileSync(
      filePath,
      JSON.stringify(payload.content, null, 2),
      "utf-8"
    );
    return NextResponse.json(
      { ok: true, target: "local" },
      { headers: noStore() }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Local write failed.",
      },
      { status: 500, headers: noStore() }
    );
  }
}
