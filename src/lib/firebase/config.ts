// src/lib/firebase/config.ts
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';

// Firebase project configuration.
// These values are primarily read from environment variables (see .env file),
// with fallbacks provided for local development if .env is not configured.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAAmZqCX7EoQMiI6TVVhNdjpN3mmTKmtJQ",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "recipe-remix-gknqn.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "recipe-remix-gknqn",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "recipe-remix-gknqn.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1039518536875",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1039518536875:web:a7d56d6f6a41352e2b13ee",
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
