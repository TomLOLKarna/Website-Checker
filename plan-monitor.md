# Plan: Website Monitor

> Stand: 2026-05-03. Projekt: github.com/TomLOLKarna/Website-Checker
> Überwacht: ostermann-digital.de (github.com/TomLOLKarna/LandingPage)

## Phase 1 – Deterministisches Monitoring ✅ FERTIG & AKTIV

| Schritt | Status |
|---|---|
| Projektstruktur (monitor/, lib/, agents/, prompts/) | ✅ |
| Uptime-Check HTTP-GET | ✅ |
| Browser-Fehler via Playwright headless | ✅ |
| Lighthouse Performance 1×/Tag | ✅ |
| State-Verwaltung (last-check.json / last-known-good.json) | ✅ |
| Discord-Alerts (Alert + Recovery-Notification) | ✅ |
| Circuit-Breaker (3× gleicher Fehler → Pause) | ✅ |
| GitHub Action Cron alle 30 Min | ✅ |
| GitHub-Secret DISCORD_WEBHOOK_URL gesetzt | ✅ |
| Erster Testlauf erfolgreich (grüner Haken) | ✅ 2026-05-03 |

**Der Monitor läuft 24/7 in der GitHub Cloud. PC muss nicht an sein.**
Alerts kommen nur bei Problemen. Wenn alles ok ist: Stille.

---

## Was bei einem Alert passiert (aktuell)

1. Discord-Nachricht mit Fehlerbeschreibung kommt an
2. Claude Code öffnen und sagen: "Meine Site hat ein Problem, schau mal"
3. Claude Code analysiert und fixt manuell

---

## Phase 2 – Self-Healing (VORBEREITET, noch inaktiv)

Architektur ist fertig gebaut. Aktivierung wenn bereit:

| Schritt | Status |
|---|---|
| Anthropic API Account anlegen (console.anthropic.com) | ⬜ |
| API-Key als GitHub-Secret `ANTHROPIC_API_KEY` hinterlegen | ⬜ |
| `AGENTS_ENABLED=true` in `.github/workflows/monitor.yml` | ⬜ |
| Triage-Agent (Haiku) implementieren | ⬜ |
| Fixer-Agent (Opus) implementieren | ⬜ |
| Reviewer-Agent (Opus) + PR-Flow implementieren | ⬜ |

**Erwartete Kosten Phase 2:** 0–2 €/Monat bei stabiler Site (nur Verbrauch, kein Abo).
**Deploy-Flow Phase 2:** Bot fixt → öffnet GitHub PR + Vercel-Preview → Tom merged manuell.

---

## Wichtige Dateien

| Datei | Zweck |
|---|---|
| `monitor/check.ts` | Hauptlauf (deterministisch, kein LLM) |
| `config.ts` | Alle Einstellungen, AGENTS_ENABLED Flag |
| `lib/notify.ts` | Discord-Webhook |
| `lib/circuit-breaker.ts` | Spam-Schutz |
| `state/` | Gitignored – Laufzeit-Statusdateien |
| `agents/` | Phase-2-Stubs (vorbereitet, inaktiv) |
| `prompts/` | Prompt-Vorlagen für Phase-2-Agenten |
| `.github/workflows/monitor.yml` | GitHub Actions Cron |

## Offenes (LandingPage allgemein)
→ Siehe `C:\Users\oster\Documents\Claude\Projects\Saas Projekt\Landingpage\plan-landingpage.md`
