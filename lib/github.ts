import type { SiteContent } from "./types";

const REPO = process.env.GITHUB_REPO;
const TOKEN = process.env.GITHUB_TOKEN;
const BRANCH = process.env.GITHUB_BRANCH ?? "main";

export function isGitHubConfigured(): boolean {
  return Boolean(REPO && TOKEN);
}

export async function getGitHubFile(
  path: string
): Promise<{ content: string; sha: string } | null> {
  if (!REPO || !TOKEN) return null;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: "application/vnd.github+json",
        },
        cache: "no-store",
        next: { revalidate: 0 },
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      content: string;
      sha: string;
      encoding: string;
    };
    const decoded =
      data.encoding === "base64"
        ? Buffer.from(data.content, "base64").toString("utf-8")
        : data.content;
    return { content: decoded, sha: data.sha };
  } catch {
    return null;
  }
}

export async function writeGitHubFile(
  path: string,
  content: string,
  message: string,
  sha?: string
): Promise<{ ok: boolean; error?: string }> {
  if (!REPO || !TOKEN) {
    return { ok: false, error: "GitHub is not configured." };
  }
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${path}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          content: Buffer.from(content, "utf-8").toString("base64"),
          branch: BRANCH,
          ...(sha ? { sha } : {}),
        }),
        cache: "no-store",
        next: { revalidate: 0 },
      }
    );
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as {
        message?: string;
      };
      return { ok: false, error: err.message ?? "GitHub write failed." };
    }
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateContentFile(
  content: SiteContent
): Promise<{ ok: boolean; error?: string }> {
  const existing = await getGitHubFile("content.json");
  return writeGitHubFile(
    "content.json",
    JSON.stringify(content, null, 2),
    "Update portfolio content via admin",
    existing?.sha
  );
}
