import { log } from "../lib/logger.ts";
import {
  readLastCheck,
  readLastKnownGood,
  writeLastCheck,
  writeLastKnownGood,
  type CheckResult,
} from "../lib/state.ts";
import { detectDegradation, buildErrorSignature } from "../lib/diff.ts";
import { sendAlert, sendRecovery } from "../lib/notify.ts";
import { checkCircuitBreaker, resetCircuitBreaker } from "../lib/circuit-breaker.ts";
import { checkUptime } from "./uptime.ts";
import { checkBrowserErrors } from "./browser.ts";
import { runLighthouseIfDue } from "./lighthouse.ts";

async function run() {
  log("info", "Monitor-Check gestartet");

  const uptimeStatus = await checkUptime("/");

  let overallStatus: CheckResult["status"] = "ok";
  if (uptimeStatus === "down" || uptimeStatus === "server-error") {
    overallStatus = "down";
  } else if (uptimeStatus !== "up") {
    overallStatus = "degraded";
  }

  // Browser-Checks nur wenn Site erreichbar
  const consoleErrors = overallStatus !== "down" ? await checkBrowserErrors("/") : [];
  if (consoleErrors.length > 0) {
    overallStatus = overallStatus === "ok" ? "degraded" : overallStatus;
  }

  // Lighthouse 1×/Tag
  const previousCheck = readLastCheck();
  const lighthouseScore = await runLighthouseIfDue();

  const result: CheckResult = {
    ts: new Date().toISOString(),
    status: overallStatus,
    uptimeStatus,
    consoleErrors,
    lighthouseScore: lighthouseScore ?? previousCheck?.lighthouseScore ?? null,
    lighthouseTs: lighthouseScore !== null ? new Date().toISOString() : (previousCheck?.lighthouseTs ?? null),
  };

  writeLastCheck(result);
  log("info", "Check-Ergebnis", { status: result.status, uptime: result.uptimeStatus });

  const baseline = readLastKnownGood();
  const { degraded, reasons } = detectDegradation(result, baseline);

  if (!degraded) {
    // Alles ok — Known-Good aktualisieren
    writeLastKnownGood(result);

    // War vorher ein Problem und ist jetzt wieder ok? Recovery-Notification.
    if (baseline && baseline.status !== "ok" && result.status === "ok") {
      await sendRecovery(result);
      resetCircuitBreaker();
    }

    log("info", "Kein Problem erkannt – kein LLM-Aufruf notwendig");
    return;
  }

  // Problem erkannt – Circuit-Breaker prüfen
  const signature = buildErrorSignature(result);
  const paused = await checkCircuitBreaker(signature);
  if (paused) return;

  // Discord-Alert senden
  await sendAlert(result, reasons);
  log("warn", "Alert gesendet", { reasons });

  // Phase 2: hier würde der Orchestrator Triage/Fixer/Reviewer starten
  // if (config.agentsEnabled) { await orchestrate(result, reasons); }
}

run().catch((err) => {
  log("error", "Unbehandelter Fehler im Monitor", { error: String(err) });
  process.exit(1);
});
