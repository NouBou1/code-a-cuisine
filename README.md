# Code a Cuisine

Angular-Webanwendung für Rezepte. Automatisierung über **n8n**-Workflows, Speicherung in **Firebase Firestore**.

## Tech-Stack

- Angular 22 (Standalone-Komponenten, SCSS)
- Firebase JS SDK (Firestore) – direkt eingebunden, da `@angular/fire` Angular 22 noch nicht unterstützt
- n8n (selbst gehostet) – Kommunikation über Webhooks
- TypeDoc für die Dokumentation (TSDoc-Kommentare)

## Setup

```bash
npm install
```

In `src/environments/environment.ts` (Produktion) und `environment.development.ts` (Entwicklung) eintragen:

- `firebase` – Web-App-Config aus der Firebase-Konsole (Projekteinstellungen → Meine Apps)
- `n8n.baseUrl` – z. B. `https://n8n.example.com/webhook` (Entwicklung: `/webhook-test`)

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
├── core/          # App-weite Singletons
│   ├── firebase/      # Firebase-/Firestore-Provider
│   ├── interceptors/  # HTTP-Interceptor (zentrale Fehlerbehandlung)
│   ├── models/        # Interfaces und Typen
│   └── services/      # N8nService, FirestoreService
├── features/      # Seiten (lazy geladen)
└── shared/        # Wiederverwendbare Komponenten
n8n/               # Exportierte n8n-Workflows (JSON)
```

## Commit-Konvention

[Conventional Commits](https://www.conventionalcommits.org/de/): `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`
