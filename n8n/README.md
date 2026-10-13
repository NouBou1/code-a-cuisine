# n8n-Workflows

Exportierte Workflows (JSON) aus der n8n-Instanz. In n8n: Workflow öffnen → **⋯ → Download**, Datei hier ablegen und committen.

Credentials werden von n8n nicht mit exportiert – trotzdem vor dem Commit prüfen, dass keine Secrets im JSON stehen.

## API-Vertrag: Rezepte generieren

Das Frontend nutzt diesen Vertrag bereits (`N8nRecipeGenerator`). Solange `useMock: true` in den Environments gesetzt ist, simuliert `MockRecipeGenerator` ihn lokal.

**Ablauf im Workflow:** Webhook → Validierung → Gemini → Firestore (`recipes`) → Response

### Request

`POST {n8n.baseUrl}/recipes/generate`

```json
{
  "ingredients": [
    { "name": "Pasta", "amount": 100, "unit": "gram" },
    { "name": "Egg", "amount": 1, "unit": "piece" }
  ],
  "preferences": {
    "portions": 2,
    "cooks": 2,
    "cookingTime": "quick",
    "cuisine": "italian",
    "diet": "vegetarian"
  }
}
```

| Feld          | Werte                                                            |
| ------------- | ---------------------------------------------------------------- |
| `unit`        | `gram`, `ml`, `piece`                                            |
| `cookingTime` | `quick` (bis 20 min), `medium` (25–40 min), `complex` (> 45 min) |
| `cuisine`     | `italian`, `german`, `japanese`, `gourmet`, `indian`, `fusion`   |
| `diet`        | `vegetarian`, `vegan`, `keto`, `none`                            |
| `portions`    | 1–12                                                             |
| `cooks`       | 1–4                                                              |

### Response `200`

Drei Rezepte, **bereits in Firestore gespeichert** (mit Dokument-ID):

```json
{
  "recipes": [
    {
      "id": "firestore-doc-id",
      "title": "Pasta with spinach and cherry tomatoes",
      "cuisine": "italian",
      "cookingTime": "quick",
      "durationMinutes": 20,
      "diet": "vegetarian",
      "portions": 2,
      "cooks": 2,
      "nutrition": { "kcal": 630, "protein": 18, "fat": 24, "carbs": 58 },
      "ingredients": [{ "quantity": "80g", "name": "Pasta noodles" }],
      "extraIngredients": [{ "quantity": "30ml", "name": "Olive oil" }],
      "steps": [{ "title": "Cook the pasta", "description": "...", "chef": 1 }],
      "likes": 0,
      "createdAt": 1791800000000
    }
  ]
}
```

- `nutrition` gilt pro Portion.
- `steps[].chef` ist 1-basiert und liegt zwischen 1 und `cooks`.
- `createdAt` in Millisekunden seit 1970 (für die Sortierung im Kochbuch).
- Das Frontend prüft die Struktur (`isRecipe`) und zeigt bei Abweichungen eine Fehlermeldung.

### Fehler

| Status | Body                                                       | Anzeige im Frontend               |
| ------ | ---------------------------------------------------------- | --------------------------------- |
| `422`  | `{ "code": "INSUFFICIENT_INGREDIENTS", "message": "..." }` | Pop-up „Ups! Not quite enough...“ |
| `400`  | `{ "code": "INVALID_INPUT", "message": "..." }`            | Pop-up mit Zurück zu den Zutaten  |
| `429`  | `{ "message": "..." }`                                     | Pop-up „Too many requests“        |
| `5xx`  | beliebig                                                   | Pop-up „Something went wrong“     |

`message` wird direkt angezeigt – also nutzerfreundlich und auf Englisch formulieren.

## Firestore

- Collection `recipes`, Dokumente wie oben (ohne `id`-Feld, die ID ist die Dokument-ID).
- Die Cuisine-Seite braucht einen zusammengesetzten Index `cuisine ASC, createdAt DESC`. Firestore zeigt beim ersten Aufruf einen Link zum Anlegen in der Browser-Konsole.
- Das Frontend schreibt nur das Feld `likes` (atomares Increment). Die Security Rules sollten Clients nur das erlauben:

```
match /recipes/{id} {
  allow read: if true;
  allow update: if request.resource.data.diff(resource.data).affectedKeys().hasOnly(['likes'])
                && request.resource.data.likes == resource.data.likes + 1;
}
```
