import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");
const SUBMISSIONS_FILE = path.join(DATA_DIR, "submissions.json");

export interface StoredSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

function ensureFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(SUBMISSIONS_FILE)) {
      fs.writeFileSync(SUBMISSIONS_FILE, "[]", "utf-8");
    }
  } catch {
    /* ignore */
  }
}

export function readSubmissions(): StoredSubmission[] {
  try {
    ensureFile();
    const raw = fs.readFileSync(SUBMISSIONS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredSubmission[]) : [];
  } catch {
    return [];
  }
}

export function addSubmission(
  submission: Omit<StoredSubmission, "id" | "created_at">
): StoredSubmission {
  const list = readSubmissions();
  const record: StoredSubmission = {
    ...submission,
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `sub_${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  list.unshift(record);
  try {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch {
    /* ignore */
  }
  return record;
}

export function deleteSubmission(id: string): boolean {
  const list = readSubmissions();
  const next = list.filter((item) => item.id !== id);
  if (next.length === list.length) {
    return false;
  }
  try {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(next, null, 2), "utf-8");
    return true;
  } catch {
    return false;
  }
}
