/**
 * Writes the mock recipes to the Realtime Database as cookbook seed data.
 * Usage: npm run seed -- <path-to-service-account.json> [database-url]
 */
import { readFileSync } from 'node:fs';
import { cert, initializeApp } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import { MOCK_RECIPES } from '../src/app/core/data/mock/mock-recipes.ts';

const keyPath = process.argv[2] ?? process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!keyPath) {
  console.error('Usage: npm run seed -- <path-to-service-account.json> [database-url]');
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'));
const databaseURL =
  process.argv[3] ??
  `https://${serviceAccount.project_id}-default-rtdb.europe-west1.firebasedatabase.app`;
const app = initializeApp({ credential: cert(serviceAccount), databaseURL });

const recipes = Object.fromEntries(
  MOCK_RECIPES.map(({ id, ...recipe }) => [id.replace(/^mock-/, ''), recipe]),
);
await getDatabase().ref('recipes').update(recipes);
await app.delete();
console.log(`Seeded ${MOCK_RECIPES.length} recipes into ${databaseURL}.`);
