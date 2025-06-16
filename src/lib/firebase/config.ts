
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

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

let app: FirebaseApp | null = null; // Allow app to be null initially
let auth: Auth | null = null;       // Allow auth to be null initially
let db: Firestore | null = null;    // Allow db to be null initially

if (missingConfigKeys.length > 0) {
  console.error(
    `Firebase config is missing the following NEXT_PUBLIC_ keys: ${missingConfigKeys.join(', ')}. ` +
    `Please ensure they are set in your .env file. Firebase will not initialize correctly.`
  );
} else {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  if (app) {
    auth = getAuth(app);
    db = getFirestore(app);
  }
}

// Export possibly null values, consuming code should check
export { app, auth, db };
