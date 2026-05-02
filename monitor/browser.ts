import { chromium } from "@playwright/test";
import { config } from "../config.ts";
import { log } from "../lib/logger.ts";

export async function checkBrowserErrors(path = "/"): Promise<string[]> {
  const url = config.siteUrl.replace(/\/$/, "") + path;
  const errors: string[] = [];

  let browser;
  try {
    browser = await chromium.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(`[console.error] ${msg.text()}`);
      }
    });

    page.on("pageerror", (err) => {
      errors.push(`[pageerror] ${err.message}`);
    });

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15_000 });
    await page.waitForTimeout(config.playwrightWaitMs);

    log("info", "Browser-Check abgeschlossen", { url, errorCount: errors.length });
  } catch (err) {
    log("error", "Browser-Check fehlgeschlagen", { url, error: String(err) });
    errors.push(`[browser-crash] ${String(err)}`);
  } finally {
    await browser?.close();
  }

  return errors;
}
