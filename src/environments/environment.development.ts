/**
 * Development environment configuration.
 *
 * Uses the n8n test webhooks (`/webhook-test`), which are active while a
 * workflow is opened in the n8n editor and listening for test events.
 */
export const environment = {
  production: false,
  /** Use in-memory mock data instead of n8n and Firestore. */
  useMock: true,
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_PROJECT.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT.firebasestorage.app',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID',
  },
  n8n: {
    baseUrl: 'https://YOUR_N8N_SERVER/webhook-test',
  },
};
