# Plan: Website Monitor

> Stand: 2026-05-02. Eigenes Projekt: C:\Users\oster\Documents\Claude\Projects\Saas Projekt\Website Checker
> Überwacht: github.com/TomLOLKarna/LandingPage → ostermann-digital.de

## Phase 1 – Deterministisches Monitoring (AKTIV)

| Schritt | Status |
|---|---|
| Projektstruktur anlegen | ✅ Erledigt |
| Uptime-Check (HTTP-GET) | ✅ Erledigt |
| Browser-Fehler (Playwright) | ✅ Erledigt |
| Lighthouse 1×/Tag | ✅ Erledigt |
| State-Verwaltung (last-check.json / last-known-good.json) | ✅ Erledigt |
| Discord-Notifications (Alert + Recovery) | ✅ Erledigt |
| Circuit-Breaker (3×-Regel) | ✅ Erledigt |
| GitHub Action Cron alle 30 Min | ✅ Erledigt |
| GitHub-Secret DISCORD_WEBHOOK_URL eintragen | ⬜ User-Aufgabe |
| Dieses Repo zu GitHub pushen + Action aktivieren | ⬜ User-Aufgabe |
| Ersten manuellen Test-Lauf starten | ⬜ User-Aufgabe |

## Phase 2 – Self-Healing (VORBEREITET, noch inaktiv)

Voraussetzung: Anthropic-API-Account (console.anthropic.com) + API-Key

| Schritt | Status |
|---|---|
| Triage-Agent (Haiku) implementieren | ⬜ Warten auf API-Key |
| Fixer-Agent (Opus) implementieren | ⬜ Warten auf API-Key |
| Reviewer-Agent (Opus, frischer Context) implementieren | ⬜ Warten auf API-Key |
| Orchestrator verknüpfen | ⬜ Warten auf API-Key |
| ANTHROPIC_API_KEY als GitHub-Secret hinterlegen | ⬜ User-Aufgabe |
| AGENTS_ENABLED=true in .github/workflows/monitor.yml setzen | ⬜ User-Aufgabe |
