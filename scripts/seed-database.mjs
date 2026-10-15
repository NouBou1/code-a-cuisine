/**
 * Writes the mock recipes to Firestore as cookbook seed data.
 * Usage: npm run seed -- <path-to-service-account.json>
 */
import { readFileSync } from 'node:fs';
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { MOCK_RECIPES } from '../src/app/core/data/mock/mock-recipes.ts';

const keyPath = process.argv[2] ?? process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!keyPath) {
  console.error('Usage: npm run seed -- <path-to-service-account.json>');
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'));
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const batch = db.batch();
for (const { id, ...recipe } of MOCK_RECIPES) {
  batch.set(db.collection('recipes').doc(id.replace(/^mock-/, '')), recipe);
}
await batch.commit();
console.log(`Seeded ${MOCK_RECIPES.length} recipes into project ${serviceAccount.project_id}.`);
