import { config } from "../config.ts";
import type { CheckResult } from "../lib/state.ts";

export type TriageCategory = "external" | "code" | "unclear";

export interface TriageInput {
  currentResult: CheckResult;
  reasons: string[];
  recentLogs: string;
}

export interface TriageResult {
  category: TriageCategory;
  reasoning: string;
}

// Phase 2: echte Haiku-Implementierung. Aktuell: Stub.
export async function classify(_input: TriageInput): Promise<TriageResult> {
  if (!config.agentsEnabled) {
    throw new Error(
      "MissingApiKeyError: Agenten sind deaktiviert. Setze AGENTS_ENABLED=true und ANTHROPIC_API_KEY um Phase 2 zu aktivieren."
    );
  }

  // TODO Phase 2: Anthropic SDK importieren, Haiku aufrufen, Prompt aus prompts/triage.md laden
  throw new Error("Triage-Agent noch nicht implementiert (Phase 2)");
}
