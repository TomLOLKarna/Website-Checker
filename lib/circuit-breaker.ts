import { config } from "../config.ts";
import { log } from "./logger.ts";
import { readCircuitBreaker, writeCircuitBreaker } from "./state.ts";
import { sendCircuitBreakerAlert } from "./notify.ts";

export async function checkCircuitBreaker(errorSignature: string): Promise<boolean> {
  const state = readCircuitBreaker();

  if (state.paused) {
    log("warn", "Circuit-Breaker ist aktiv – Monitor pausiert", { signature: errorSignature });
    return true;
  }

  if (state.lastSignature === errorSignature) {
    const newCount = state.count + 1;
    if (newCount >= config.circuitBreakerThreshold) {
      writeCircuitBreaker({ count: newCount, lastSignature: errorSignature, paused: true });
      log("error", "Circuit-Breaker ausgelöst", { count: newCount, signature: errorSignature });
      await sendCircuitBreakerAlert(errorSignature);
      return true;
    }
    writeCircuitBreaker({ count: newCount, lastSignature: errorSignature, paused: false });
  } else {
    writeCircuitBreaker({ count: 1, lastSignature: errorSignature, paused: false });
  }

  return false;
}

export function resetCircuitBreaker() {
  writeCircuitBreaker({ count: 0, lastSignature: "", paused: false });
  log("info", "Circuit-Breaker zurückgesetzt");
}
