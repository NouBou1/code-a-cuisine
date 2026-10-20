// Template: copy to `environment.ts` (production: true) and `environment.development.ts` (production: false).
export const environment = {
  production: true,
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
    databaseURL: 'https://YOUR_PROJECT_ID-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT_ID.firebasestorage.app',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID',
  },
  n8n: {
    baseUrl: 'https://n8n.example.com/webhook',
  },
};
