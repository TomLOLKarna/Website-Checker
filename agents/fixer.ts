import { config } from "../config.ts";
import type { CheckResult } from "../lib/state.ts";

export interface FixerInput {
  currentResult: CheckResult;
  reasons: string[];
  stacktrace: string;
  affectedFiles: string[];
}

export interface FixProposal {
  branchName: string;
  commitMessage: string;
  changedFiles: string[];
  prTitle: string;
  prBody: string;
}

// Phase 2: echte Opus-Implementierung. Aktuell: Stub.
export async function proposeFix(_input: FixerInput): Promise<FixProposal> {
  if (!config.agentsEnabled) {
    throw new Error(
      "MissingApiKeyError: Agenten sind deaktiviert. Setze AGENTS_ENABLED=true und ANTHROPIC_API_KEY um Phase 2 zu aktivieren."
    );
  }

  // TODO Phase 2: Anthropic SDK importieren, Opus aufrufen, Prompt aus prompts/fixer.md laden
  // Fixer checkt Branch aus, schreibt Fix, übergibt an Reviewer
  // WICHTIG: Niemals git merge ausführen – nur Branch pushen + gh pr create
  throw new Error("Fixer-Agent noch nicht implementiert (Phase 2)");
}
