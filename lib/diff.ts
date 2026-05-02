import type { CheckResult } from "./state.ts";

const STATUS_RANK: Record<CheckResult["status"], number> = {
  ok: 0,
  degraded: 1,
  down: 2,
};

export interface DiffResult {
  degraded: boolean;
  reasons: string[];
}

export function detectDegradation(current: CheckResult, baseline: CheckResult | null): DiffResult {
  const reasons: string[] = [];

  if (!baseline) {
    if (current.status !== "ok") {
      reasons.push(`Erster Lauf nach Start: Status ist ${current.status}`);
    }
    return { degraded: reasons.length > 0, reasons };
  }

  // Status schlechter geworden?
  if (STATUS_RANK[current.status] > STATUS_RANK[baseline.status]) {
    reasons.push(`Status verschlechtert: ${baseline.status} → ${current.status}`);
  }

  // Neue Console-Errors aufgetaucht?
  const newErrors = current.consoleErrors.filter(
    (e) => !baseline.consoleErrors.includes(e)
  );
  if (newErrors.length > 0) {
    reasons.push(`Neue Browser-Fehler: ${newErrors.join(" | ")}`);
  }

  // Lighthouse-Score um mehr als 10% gefallen?
  if (
    current.lighthouseScore !== null &&
    baseline.lighthouseScore !== null &&
    current.lighthouseScore < baseline.lighthouseScore * 0.9
  ) {
    reasons.push(
      `Lighthouse Performance fiel von ${baseline.lighthouseScore} auf ${current.lighthouseScore}`
    );
  }

  return { degraded: reasons.length > 0, reasons };
}

export function buildErrorSignature(result: CheckResult): string {
  return `${result.uptimeStatus}|${result.consoleErrors.sort().join(",")}`;
}
