import { NextRequest, NextResponse } from "next/server";
import { uploadImage, isCloudinaryConfigured } from "@/lib/cloudinary";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

function noStore(): Record<string, string> {
  return { "Cache-Control": "no-store, max-age=0" };
}

export async function POST(request: NextRequest) {
  const authed = await getSession();
  if (!authed) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401, headers: noStore() }
    );
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Cloudinary is not configured on the server." },
      { status: 503, headers: noStore() }
    );
  }

  let payload: { dataUrl?: string };
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400, headers: noStore() }
    );
  }

  if (!payload.dataUrl || !payload.dataUrl.startsWith("data:image")) {
    return NextResponse.json(
      { ok: false, error: "A valid image data URL is required." },
      { status: 400, headers: noStore() }
    );
  }

  const result = await uploadImage(payload.dataUrl);
  if (!result.ok || !result.url) {
    return NextResponse.json(
      { ok: false, error: result.error ?? "Upload failed." },
      { status: 500, headers: noStore() }
    );
  }

  return NextResponse.json(
    { ok: true, url: result.url },
    { headers: noStore() }
  );
}
