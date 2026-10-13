/**
 * Production environment configuration.
 *
 * Replace the placeholder values with the config of your Firebase project
 * and the base URL of your n8n instance.
 */
export const environment = {
  production: true,
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
    baseUrl: 'https://YOUR_N8N_SERVER/webhook',
  },
};
