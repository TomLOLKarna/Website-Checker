import { config } from "../config.ts";
import type { FixProposal } from "./fixer.ts";

export type ReviewVerdict = "approved" | "rejected";

export interface ReviewerInput {
  proposal: FixProposal;
  diff: string;
  buildLog: string;
  playwrightLog: string;
}

export interface ReviewResult {
  verdict: ReviewVerdict;
  feedback: string;
  prUrl?: string;
}

// Phase 2: echte Opus-Implementierung (separater frischer Context). Aktuell: Stub.
export async function review(_input: ReviewerInput): Promise<ReviewResult> {
  if (!config.agentsEnabled) {
    throw new Error(
      "MissingApiKeyError: Agenten sind deaktiviert. Setze AGENTS_ENABLED=true und ANTHROPIC_API_KEY um Phase 2 zu aktivieren."
    );
  }

  // TODO Phase 2: Anthropic SDK importieren, Opus mit frischem Context aufrufen
  // Bei approved: gh pr create – NIEMALS git merge direkt!
  // Reviewer öffnet PR + Vercel-Preview-URL, User merged manuell
  throw new Error("Reviewer-Agent noch nicht implementiert (Phase 2)");
}
