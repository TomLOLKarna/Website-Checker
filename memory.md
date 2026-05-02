# Memory – Website Checker Projekt

> Zuletzt aktualisiert: 2026-05-03
> Zweck: Kontext für neue Claude-Sessions, damit sofort weitergearbeitet werden kann.

---

## Wer bin ich / Wer ist Tom

- **Name:** Tom Ostermann
- **E-Mail:** ostermann.tom2007@gmail.com
- **GitHub:** TomLOLKarna
- **Abo:** Claude Pro (≠ Anthropic API – das sind zwei verschiedene Dinge)
- **Technisches Niveau:** Nicht-Entwickler, arbeitet mit Claude Code zusammen

---

## Projekte

| Projekt | GitHub | Lokal |
|---|---|---|
| **Website Checker (Monitor)** | github.com/TomLOLKarna/Website-Checker | `C:\Users\oster\Documents\Claude\Projects\Saas Projekt\Website Checker` |
| **Landing Page** | github.com/TomLOLKarna/LandingPage | `C:\Users\oster\Documents\Claude\Projects\Saas Projekt\Landingpage` |

- **Production-URL:** https://ostermann-digital.de
- **Tech-Stack LandingPage:** Next.js 15, Pages Router, Supabase, next-auth, Resend, Vercel

---

## Was gebaut wurde (Website Checker)

Autonomes 24/7-Monitoring für ostermann-digital.de. Läuft komplett in der GitHub Cloud (kein PC nötig).

**Was der Monitor alle 30 Minuten prüft:**
- HTTP-Uptime (ist die Site erreichbar?)
- Browser-Fehler via Playwright (Console-Errors, Page-Errors)
- Lighthouse Performance (1× täglich)

**Bei Problemen:** Discord-Nachricht mit Fehlerbeschreibung
**Bei Erholung:** Discord-Nachricht "wieder normal"
**Spam-Schutz:** Circuit-Breaker – nach 3× gleichem Fehler pausiert der Monitor

**Aktueller Status: Phase 1 aktiv und getestet ✅ (erster grüner Lauf: 2026-05-03)**

---

## Dateistruktur

```
Website Checker/
├── monitor/check.ts        # Hauptlauf – deterministisch, kein LLM
├── monitor/uptime.ts       # HTTP-Check
├── monitor/browser.ts      # Playwright Browser-Check
├── monitor/lighthouse.ts   # Lighthouse (1×/Tag)
├── lib/state.ts            # last-check.json / last-known-good.json
├── lib/diff.ts             # Verschlechterungs-Erkennung
├── lib/notify.ts           # Discord-Webhook
├── lib/circuit-breaker.ts  # 3×-Regel
├── lib/logger.ts           # JSONL-Logging
├── agents/triage.ts        # Phase-2-Stub (Haiku) – noch inaktiv
├── agents/fixer.ts         # Phase-2-Stub (Opus) – noch inaktiv
├── agents/reviewer.ts      # Phase-2-Stub (Opus) – noch inaktiv
├── prompts/triage.md       # Prompt-Vorlage Triage
├── prompts/fixer.md        # Prompt-Vorlage Fixer
├── prompts/reviewer.md     # Prompt-Vorlage Reviewer
├── orchestrator.ts         # Verbindet Agenten (Phase 2)
├── config.ts               # Einstellungen + AGENTS_ENABLED Flag
├── .github/workflows/monitor.yml  # Cron alle 30 Min
├── state/                  # Gitignored – Laufzeit-Status
├── .env.example            # Vorlage für lokale Secrets
├── plan-monitor.md         # Projekt-Plan
└── memory.md               # Diese Datei
```

---

## Secrets & Zugänge

| Was | Wo gespeichert |
|---|---|
| Discord-Webhook | GitHub Secret `DISCORD_WEBHOOK_URL` in TomLOLKarna/Website-Checker |
| Anthropic API Key | Noch nicht vorhanden – für Phase 2 |

**Wichtig:** Der GitHub PAT (`ghp_...`) den Tom erstellt hat ist einmalig verwendet worden. Widerrufen unter: https://github.com/settings/tokens

---

## Wichtige Links

- Actions / Workflow-Status: https://github.com/TomLOLKarna/Website-Checker/actions
- Secrets verwalten: https://github.com/TomLOLKarna/Website-Checker/settings/secrets/actions
- Token widerrufen: https://github.com/settings/tokens

---

## Was bei einem Discord-Alert zu tun ist (Phase 1)

1. Discord-Nachricht mit Fehlerbeschreibung lesen
2. Claude Code öffnen im Website-Checker- oder LandingPage-Ordner
3. Sagen: *"Meine Site hat ein Problem, schau mal"*
4. Claude Code analysiert und fixt

---

## Phase 2 – Self-Healing (vorbereitet, noch inaktiv)

Aktivierung wenn bereit:
1. Account anlegen auf console.anthropic.com (≠ Claude Pro!)
2. API-Key generieren → als GitHub-Secret `ANTHROPIC_API_KEY` hinterlegen
3. In `.github/workflows/monitor.yml` auskommentierte Zeilen aktivieren
4. `AGENTS_ENABLED=true` setzen
5. Agents in `agents/triage.ts`, `fixer.ts`, `reviewer.ts` implementieren

**Kosten Phase 2:** 0–2 €/Monat bei stabiler Site
**Deploy-Flow Phase 2:** Bot fixt → PR öffnen → Tom merged manuell (kein Auto-Merge!)

---

## gh CLI (für nächste Session)

GitHub CLI ist installiert unter `C:\Program Files\GitHub CLI\gh.exe`.
Funktioniert nur via PowerShell mit Token (kein interaktiver Login in Claude Code):

```powershell
$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")
$env:GH_TOKEN = "ghp_..."
& "C:\Program Files\GitHub CLI\gh.exe" <befehl>
```

---

## Offene Punkte LandingPage

Siehe: `C:\Users\oster\Documents\Claude\Projects\Saas Projekt\Landingpage\plan-landingpage.md`
- Impressum + Datenschutz (Tom liefert Adresse + USt-ID)
- Sicherheits- & Datenschutz-Check via `/security-review`
