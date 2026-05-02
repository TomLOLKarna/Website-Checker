import { config } from "../config.ts";
import { log } from "../lib/logger.ts";
import { readLighthouseTs, writeLighthouseTs } from "../lib/state.ts";

export async function runLighthouseIfDue(): Promise<number | null> {
  const lastTs = readLighthouseTs();
  if (lastTs) {
    const hoursSince = (Date.now() - new Date(lastTs).getTime()) / 1000 / 3600;
    if (hoursSince < config.lighthouseIntervalHours) {
      log("info", `Lighthouse übersprungen – letzter Run vor ${hoursSince.toFixed(1)}h`);
      return null;
    }
  }

  try {
    const { default: lighthouse } = await import("lighthouse");
    const { default: chromeLauncher } = await import("chrome-launcher");

    const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless", "--no-sandbox"] });
    const result = await lighthouse(config.siteUrl, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      onlyCategories: ["performance"],
    });
    await chrome.kill();

    const score = result?.lhr?.categories?.performance?.score;
    if (score == null) {
      log("warn", "Lighthouse lieferte keinen Performance-Score");
      return null;
    }

    const rounded = Math.round(score * 100);
    writeLighthouseTs(new Date().toISOString());
    log("info", `Lighthouse Performance-Score: ${rounded}`);
    return rounded;
  } catch (err) {
    log("error", "Lighthouse fehlgeschlagen", { error: String(err) });
    return null;
  }
}
