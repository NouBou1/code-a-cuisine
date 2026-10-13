# Code à Cuisine

AI-gestützter Rezeptgenerator: Nutzer geben ihre vorhandenen Zutaten und Präferenzen ein, ein **n8n**-Workflow erzeugt mit **Google Gemini** passende Rezepte und speichert sie in **Firebase Firestore**. Alle Rezepte landen im öffentlichen Kochbuch und können gelikt werden.

## Features

- **Generator in zwei Schritten**: Zutaten (mit Menge und Einheit, bearbeiten/löschen) → Präferenzen (Portionen, Anzahl Köche, Kochzeit, Küche, Ernährung)
- **Ladeanimation** während der Generierung, **Fehler-Pop-up** bei unzureichenden Zutaten
- **Rezeptansicht** mit Nährwerten, eigenen und zusätzlichen Zutaten, Arbeitsschritten pro Koch und Like-Funktion (1× pro Browser)
- **Kochbuch** mit den beliebtesten Rezepten und Kategorien je Küche inkl. Pagination
- Responsive (Mobile, Desktop, Widescreen ab 1440 px), semantisches HTML, tastaturbedienbar

## Tech-Stack

- Angular 22 (Standalone-Komponenten, Signals, SCSS)
- Firebase JS SDK (Firestore) – direkt eingebunden, da `@angular/fire` Angular 22 noch nicht unterstützt
- n8n (selbst gehostet) mit Google Gemini – Kommunikation über Webhooks
- Schriften lokal über Fontsource (Quicksand, Ubuntu, Mulish) – keine Google-Fonts-Anfragen
- Vitest für Unit-Tests, TypeDoc für die Dokumentation

## Setup

```bash
npm install
npm start
```

Die App läuft danach auf http://localhost:4200 – standardmäßig mit **Mock-Daten**, also ohne Backend.

### Backend anbinden

In `src/environments/environment.ts` (Produktion) und `environment.development.ts` (Entwicklung):

1. `useMock` auf `false` setzen
2. `firebase` – Web-App-Config aus der Firebase-Konsole (Projekteinstellungen → Meine Apps)
3. `n8n.baseUrl` – z. B. `https://n8n.example.com/webhook` (Entwicklung: `/webhook-test`)

Den API-Vertrag für den n8n-Workflow und die Firestore-Regeln beschreibt [n8n/README.md](n8n/README.md).

## Skripte

| Befehl          | Beschreibung                                   |
| --------------- | ---------------------------------------------- |
| `npm start`     | Dev-Server auf http://localhost:4200           |
| `npm run build` | Produktions-Build nach `dist/`                 |
| `npm test`      | Unit-Tests (Vitest)                            |
| `npm run docs`  | Generiert die TSDoc-Dokumentation nach `docs/` |

## Projektstruktur

```
src/app/
├── core/
│   ├── constants/     # Auswahloptionen (Küchen, Kochzeiten, Ernährung)
│   ├── data/          # RecipeGenerator & CookbookService (n8n/Firestore + Mock)
│   ├── firebase/      # Firebase-/Firestore-Provider
│   ├── guards/        # Schutz der Generator-Schritte
│   ├── interceptors/  # Zentrale HTTP-Fehlerbehandlung
│   ├── models/        # Interfaces und Typen
│   ├── services/      # N8nService, FirestoreService, LikeService
│   └── state/         # GeneratorStore (Zustand über die Schritte)
├── features/
│   ├── home/          # Startseite
│   ├── generator/     # Zutaten, Präferenzen, Ergebnisse
│   ├── recipe/        # Rezeptansicht
│   └── cookbook/      # Kochbuch und Küchen-Listen
└── shared/components/ # Menüleiste, Loader, Pop-up, Pagination, ...
public/assets/         # Aus Figma exportierte Bilder und Icons (WebP/SVG)
n8n/                   # Workflows und API-Vertrag
```

## Commit-Konvention

[Conventional Commits](https://www.conventionalcommits.org/de/): `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`
