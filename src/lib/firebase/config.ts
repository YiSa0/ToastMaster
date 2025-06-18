import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if all config values are present
const missingConfigKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

let app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
let auth: Auth = getAuth(app);
let db: Firestore = getFirestore(app);

if (missingConfigKeys.length > 0) {
  console.error(
    `Firebase config is missing the following NEXT_PUBLIC_ keys: ${missingConfigKeys.join(', ')}. ` +
    `Please ensure they are set in your .env file. Firebase will not initialize correctly.`
  );
}

// Export possibly null values, consuming code should check
export { app, auth, db };
