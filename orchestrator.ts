import { config } from "./config.ts";
import { log } from "./lib/logger.ts";
import type { CheckResult } from "./lib/state.ts";

// Phase 2 Entry-Point – wird von monitor/check.ts aufgerufen, wenn AGENTS_ENABLED=true
export async function orchestrate(result: CheckResult, reasons: string[]) {
  if (!config.agentsEnabled) {
    log("info", "Agenten deaktiviert (Phase 1) – kein Self-Healing");
    return;
  }

  if (!config.anthropicApiKey) {
    throw new Error(
      "MissingApiKeyError: Set ANTHROPIC_API_KEY in GitHub Secrets um Self-Healing zu aktivieren."
    );
  }

  // Phase 2 Ablauf:
  // 1. Triage (Haiku) → Kategorie bestimmen
  // 2. Bei 'external' → nur Notification, fertig
  // 3. Bei 'code' → Fixer (Opus) → Fix vorschlagen
  // 4. Reviewer (Opus, frischer Context) → PR öffnen oder ablehnen
  // 5. Bei 'unclear' → Notification, kein Fix-Versuch

  log("info", "Orchestrator gestartet", { status: result.status, reasons });

  const { classify } = await import("./agents/triage.ts");
  const triage = await classify({ currentResult: result, reasons, recentLogs: "" });
  log("info", "Triage-Ergebnis", { category: triage.category, reasoning: triage.reasoning });

  if (triage.category === "external" || triage.category === "unclear") {
    log("warn", `Kein Code-Fix gestartet (Kategorie: ${triage.category})`);
    return;
  }

  const { proposeFix } = await import("./agents/fixer.ts");
  const proposal = await proposeFix({
    currentResult: result,
    reasons,
    stacktrace: "",
    affectedFiles: [],
  });
  log("info", "Fix-Vorschlag erstellt", { branch: proposal.branchName });

  const { review } = await import("./agents/reviewer.ts");
  const reviewResult = await review({
    proposal,
    diff: "",
    buildLog: "",
    playwrightLog: "",
  });
  log("info", "Review-Ergebnis", { verdict: reviewResult.verdict });
}
