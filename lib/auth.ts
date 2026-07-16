const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "melisha-admin";
export const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ?? "melisha-session-secret";

export function verifyPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export const AUTH_COOKIE_NAME = "mp_admin_session";

export function createSessionToken(): string {
  const base = `${Date.now()}:${Math.random()}`;
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Buffer.from(base).toString("base64");
}

export async function getSession(): Promise<boolean> {
  try {
    const { cookies } = await import("next/headers");
    const store = await cookies();
    const token = store.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return false;
    return token === SESSION_SECRET;
  } catch {
    return false;
  }
}
