import { config } from "../config.ts";
import { log } from "./logger.ts";
import type { CheckResult } from "./state.ts";

interface DiscordEmbed {
  title: string;
  description: string;
  color: number;
  fields?: { name: string; value: string; inline?: boolean }[];
  footer?: { text: string };
  timestamp?: string;
}

async function post(embed: DiscordEmbed) {
  if (!config.discordWebhookUrl) {
    log("warn", "DISCORD_WEBHOOK_URL nicht gesetzt – Notification übersprungen");
    return;
  }

  const res = await fetch(config.discordWebhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ embeds: [embed] }),
  });

  if (!res.ok) {
    log("error", "Discord-Webhook fehlgeschlagen", { status: res.status });
  }
}

export async function sendAlert(result: CheckResult, reasons: string[]) {
  const color = result.status === "down" ? 0xff0000 : 0xff9900;
  const emoji = result.status === "down" ? "🔴" : "🟡";

  await post({
    title: `${emoji} Website-Alert: ${result.status.toUpperCase()}`,
    description: `**${config.siteUrl}** hat ein Problem erkannt.`,
    color,
    fields: [
      { name: "Status", value: result.uptimeStatus, inline: true },
      { name: "Erkannte Probleme", value: reasons.join("\n") || "–" },
      {
        name: "Links",
        value: `[Website öffnen](${config.siteUrl})`,
      },
    ],
    footer: { text: "ostermann-digital Monitor" },
    timestamp: result.ts,
  });
}

export async function sendRecovery(result: CheckResult) {
  await post({
    title: "✅ Website wieder normal",
    description: `**${config.siteUrl}** ist wieder erreichbar und ohne Fehler.`,
    color: 0x00cc44,
    footer: { text: "ostermann-digital Monitor" },
    timestamp: result.ts,
  });
}

export async function sendCircuitBreakerAlert(signature: string) {
  await post({
    title: "⛔ Circuit-Breaker ausgelöst",
    description: `Derselbe Fehler trat **${config.circuitBreakerThreshold}×** in Folge auf. Monitor ist pausiert.\nBitte das Problem manuell prüfen und dann \`state/circuit-breaker.json\` auf \`{"paused":false,"count":0,"lastSignature":""}\` zurücksetzen.`,
    color: 0x990000,
    fields: [{ name: "Fehler-Signatur", value: signature }],
    footer: { text: "ostermann-digital Monitor" },
    timestamp: new Date().toISOString(),
  });
}

export async function sendTestNotification() {
  await post({
    title: "🧪 Test-Notification",
    description: "Discord-Webhook funktioniert korrekt.",
    color: 0x0099ff,
    footer: { text: "ostermann-digital Monitor" },
    timestamp: new Date().toISOString(),
  });
  log("info", "Test-Notification gesendet");
}
