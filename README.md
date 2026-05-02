# Website Monitor – ostermann-digital.de

Autonomes 24/7-Monitoring für deine Next.js-Site. Phase 1 läuft komplett **ohne API-Kosten** (0 Token, 0 €/Monat).

## Was der Monitor prüft

| Check | Frequenz | Kosten |
|---|---|---|
| HTTP-Uptime (`/`) | alle 30 Min | 0 € |
| Browser-Fehler (Playwright) | alle 30 Min | 0 € |
| Lighthouse Performance | 1× täglich | 0 € |

Bei Verschlechterung → Discord-Alert mit Details. Bei Erholung → Recovery-Notification.

## Setup (5 Minuten)

### 1. Discord-Webhook erstellen
1. Öffne deinen Discord-Server
2. Gehe zu einem Kanal → Einstellungen → Integrationen → Webhooks
3. Klick "Neuer Webhook", kopiere die URL

### 2. GitHub-Secret hinterlegen
1. Gehe zu: `https://github.com/TomLOLKarna/LandingPage/settings/secrets/actions`
2. Klick "New repository secret"
3. Name: `DISCORD_WEBHOOK_URL`, Wert: deine Webhook-URL

### 3. GitHub Actions aktivieren
1. Gehe zu: `https://github.com/TomLOLKarna/LandingPage/actions`
2. Klick "I understand my workflows, go ahead and enable them" (falls nötig)
3. Wähle "Website Monitor" → "Run workflow" zum ersten Test

### 4. Lokal testen (optional)
```bash
cd website-monitor
npm install
npx playwright install chromium
cp .env.example .env.local
# DISCORD_WEBHOOK_URL in .env.local eintragen
npx tsx monitor/check.ts
```

## Dateien

```
website-monitor/
├── monitor/check.ts        # Hauptlauf (deterministisch, kein LLM)
├── lib/notify.ts           # Discord-Alerts
├── lib/circuit-breaker.ts  # Spam-Schutz (3× gleicher Fehler → Pause)
├── state/                  # Gitignored – Status-Dateien
├── agents/                 # Phase-2-Stubs (noch inaktiv)
├── prompts/                # Prompt-Vorlagen für Phase 2
└── config.ts               # Alle Einstellungen
```

## Circuit-Breaker zurücksetzen

Wenn der Monitor pausiert wurde (3× gleicher Fehler), setze diese Datei zurück:
```
website-monitor/state/circuit-breaker.json
```
Inhalt: `{"paused": false, "count": 0, "lastSignature": ""}`

## Phase 2 – Self-Healing (später)

Wenn du Self-Healing aktivieren willst (Anthropic API nötig):

1. Account erstellen auf [console.anthropic.com](https://console.anthropic.com)
2. API-Key generieren, als GitHub-Secret `ANTHROPIC_API_KEY` hinterlegen
3. In `.github/workflows/monitor.yml` diese Zeilen auskommentieren:
   ```yaml
   # ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
   # AGENTS_ENABLED: "true"
   ```
4. In `agents/triage.ts`, `fixer.ts`, `reviewer.ts` die TODO-Phase-2-Stellen implementieren

Erwartete Kosten Phase 2 bei stabiler Site: **< 1 €/Monat**.

## Routen erweitern

Weitere Routen überwachen? In `config.ts`:
```ts
monitoredPaths: ["/", "/pricing", "/buchung"],
```
