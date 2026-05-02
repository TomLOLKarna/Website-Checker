import fs from "fs";
import path from "path";

const LOG_FILE = path.join(import.meta.dirname, "..", "state", "monitor.jsonl");

export type LogLevel = "info" | "warn" | "error";

export function log(level: LogLevel, message: string, data?: Record<string, unknown>) {
  const entry = {
    ts: new Date().toISOString(),
    level,
    message,
    ...data,
  };
  const line = JSON.stringify(entry);
  console.log(line);

  try {
    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
    fs.appendFileSync(LOG_FILE, line + "\n", "utf8");
  } catch {
    // Logging failure should not crash the monitor
  }
}
