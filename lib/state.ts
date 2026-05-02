import fs from "fs";
import path from "path";

const STATE_DIR = path.join(import.meta.dirname, "..", "state");

export interface CheckResult {
  ts: string;
  status: "ok" | "degraded" | "down";
  uptimeStatus: UptimeStatus;
  consoleErrors: string[];
  lighthouseScore: number | null;
  lighthouseTs: string | null;
}

export type UptimeStatus = "up" | "redirect" | "client-error" | "server-error" | "down";

export interface CircuitBreakerState {
  count: number;
  lastSignature: string;
  paused: boolean;
}

function filePath(name: string) {
  return path.join(STATE_DIR, name);
}

function readJson<T>(name: string, fallback: T): T {
  try {
    const raw = fs.readFileSync(filePath(name), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(name: string, data: unknown) {
  fs.mkdirSync(STATE_DIR, { recursive: true });
  fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2), "utf8");
}

export function readLastCheck(): CheckResult | null {
  return readJson<CheckResult | null>("last-check.json", null);
}

export function writeLastCheck(result: CheckResult) {
  writeJson("last-check.json", result);
}

export function readLastKnownGood(): CheckResult | null {
  return readJson<CheckResult | null>("last-known-good.json", null);
}

export function writeLastKnownGood(result: CheckResult) {
  writeJson("last-known-good.json", result);
}

export function readCircuitBreaker(): CircuitBreakerState {
  return readJson<CircuitBreakerState>("circuit-breaker.json", {
    count: 0,
    lastSignature: "",
    paused: false,
  });
}

export function writeCircuitBreaker(state: CircuitBreakerState) {
  writeJson("circuit-breaker.json", state);
}

export function readLighthouseTs(): string | null {
  return readJson<string | null>("lighthouse-ts.json", null);
}

export function writeLighthouseTs(ts: string) {
  writeJson("lighthouse-ts.json", ts);
}
