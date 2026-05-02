export const config = {
  siteUrl: process.env.SITE_URL ?? "https://ostermann-digital.de",
  discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL ?? "",

  // Phase 2: auf true setzen + ANTHROPIC_API_KEY in Secrets hinterlegen
  agentsEnabled: process.env.AGENTS_ENABLED === "true",
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? "",

  // Monitor-Einstellungen
  uptimeTimeoutMs: 10_000,
  playwrightWaitMs: 5_000,
  lighthouseIntervalHours: 23,

  // Circuit-Breaker
  circuitBreakerThreshold: 3,

  // Routen die überwacht werden (nur Public-Routes!)
  monitoredPaths: ["/"],
} as const;
