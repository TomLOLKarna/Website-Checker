# Phase 2: Diagnose und Reparatur per PR

Phase 2 erweitert den Monitor nur um einen vorbereiteten Reparaturvorschlag. Die Produktion bleibt immer unter menschlicher Kontrolle.

## Harte Grenzen

- Kein automatischer Merge, kein Push auf `main`, kein Deploy und keine Änderung von Vercel-Einstellungen.
- Der planmäßige 30-Minuten-Monitor bleibt deterministisch und startet keine KI-Agenten.
- Eine Reparatur darf ausschließlich manuell über `workflow_dispatch` nach einem bestätigten Alert angestoßen werden.
- Bei fehlendem Kontext, externen Ursachen, Sicherheits-, Datenschutz- oder Zahlungsproblemen endet der Ablauf mit einem Discord-Bericht – ohne Codeänderung.
- Es wird immer nur ein Reparaturversuch pro Incident erlaubt. Weitere Versuche brauchen eine neue manuelle Freigabe.

## Geplanter Ablauf

1. Tom bestätigt einen Discord-Alert und startet den manuellen Diagnose-Workflow mit Incident-ID.
2. Triage ordnet ein: `external`, `code` oder `unclear`.
3. Nur bei `code` erzeugt der Fixer einen Patch auf einem neuen Branch im LandingPage-Repository.
4. Der Workflow führt Build, relevante Tests und Browser-Check gegen die Vercel-Preview aus.
5. Ein unabhängiger Review prüft Diff, Tests und Grenzen. Bei Ablehnung wird nur berichtet.
6. Bei Freigabe wird ein Pull Request geöffnet – mit Ursache, Diff-Zusammenfassung, Testnachweisen und Preview-Link.
7. Tom prüft und merged den PR selbst.

## Vor Implementierung erforderlich

- Separate GitHub App oder Fine-Grained Token nur für `TomLOLKarna/LandingPage`: Contents write und Pull requests write; kein Admin-Zugriff.
- `ANTHROPIC_API_KEY` und Repo-Token ausschließlich als GitHub Secrets.
- Manueller Workflow mit verpflichtender Incident-ID und klarer Ziel-Branch `main`.
- Testkommando, Preview-URL und maximal erlaubte Dateipfade als Allowlist festlegen.
- Kostenlimit und Abbruchregel je Incident dokumentieren.

## Nicht erlaubte Fixes

- Secrets, Env-Vars, Domain/DNS, Datenbank-Migrationen, Auth, Zahlungs- oder Rechtsseiten.
- Abhängigkeiten aktualisieren, wenn sie nicht eindeutig Ursache des Incidents sind.
- Änderungen an Kunden- oder Produktionsdaten.

Bis diese Voraussetzungen umgesetzt und einmal an einer absichtlich defekten Preview getestet sind, bleibt Phase 2 deaktiviert.
