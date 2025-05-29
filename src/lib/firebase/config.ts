// src/lib/firebase/config.ts
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';

// IMPORTANT: Replace this with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "your-auth-domain",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-storage-bucket",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "your-messaging-sender-id",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "your-app-id",
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

auth = getAuth(app);
db = getFirestore(app);

// Optional: Connect to Firebase emulators if running in development
// Make sure to start emulators: firebase emulators:start
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Check if emulators are already running to avoid re-connecting
  // This check is a bit naive, real emulator detection might be more complex
  // For simplicity, we assume if one is connected, others might be too.
  // A more robust check might involve trying a dummy request or checking a specific global flag.
  if (!(auth as any).emulatorConfig) {
     try {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      console.log("Auth emulator connected");
    } catch (error) {
      console.warn("Auth emulator connection failed (might already be connected or not running):", error);
    }
  }
  if (!(db as any).emulatorConfig) {
    try {
      connectFirestoreEmulator(db, 'localhost', 8080);
      console.log("Firestore emulator connected");
    } catch (error) {
      console.warn("Firestore emulator connection failed (might already be connected or not running):", error);
    }
  }
}


export { app, auth, db };
