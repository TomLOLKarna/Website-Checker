import { config } from "../config.ts";
import { log } from "../lib/logger.ts";
import type { UptimeStatus } from "../lib/state.ts";

export async function checkUptime(path = "/"): Promise<UptimeStatus> {
  const url = config.siteUrl.replace(/\/$/, "") + path;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), config.uptimeTimeoutMs);

    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "manual",
    });
    clearTimeout(timer);

    if (res.status >= 200 && res.status < 300) return "up";
    if (res.status >= 300 && res.status < 400) return "redirect";
    if (res.status >= 400 && res.status < 500) return "client-error";
    if (res.status >= 500) return "server-error";

    return "down";
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      log("warn", "Uptime-Check Timeout", { url });
    } else {
      log("error", "Uptime-Check Fehler", { url, error: String(err) });
    }
    return "down";
  }
}
