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
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "recipe-remix-gknqn.firebasestorage.app", // Corrected from .appspot.com if yours is .app
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1039518536875",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1039518536875:web:a7d56d6f6a41352e2b13ee",
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// Initialize Firebase
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

auth = getAuth(app);
db = getFirestore(app);

// Connect to Firebase emulators if running in development
// This applies to both client-side and server-side (Server Actions) environments
if (process.env.NODE_ENV === 'development') {
  console.log("Development mode detected, attempting to connect to emulators.");

  // Connect Auth Emulator
  // Note: (auth as any).emulatorConfig is a client-side check.
  // For server-side, connectEmulator is typically called once.
  // We'll assume it's safe to call, or Firebase handles redundant calls.
  try {
    // Check if already connected can be tricky across environments.
    // Firebase SDKs usually handle if connectAuthEmulator is called multiple times on the same instance.
    // However, to be safer and avoid warnings, especially for server-side code that might re-evaluate this module,
    // we make a simpler check. A more robust solution might involve a global flag.
    if (!(auth as any)._isEmulated) { // A common internal flag, though not officially documented for this purpose
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
        console.log("Auth emulator connected or connection attempt made.");
        (auth as any)._isEmulated = true; // Mark as emulated
    } else {
        console.log("Auth emulator already connected.");
    }
  } catch (error) {
    console.warn("Auth emulator connection failed (might be due to various reasons, check emulator status):", error);
  }

  // Connect Firestore Emulator
  try {
    // Similar to Auth, checking if already connected.
    // Firestore client SDK's `connectFirestoreEmulator` can be called multiple times,
    // but it only takes effect on the first call for a given Firestore instance.
    // We use a simple custom flag to avoid repeated console logs or potential issues in server environments.
    const dbInstance = db as any;
    if (!dbInstance._isEmulated) {
        connectFirestoreEmulator(db, 'localhost', 8080);
        console.log("Firestore emulator connected or connection attempt made.");
        dbInstance._isEmulated = true; // Mark as emulated
    } else {
        console.log("Firestore emulator already connected.");
    }
  } catch (error) {
    console.warn("Firestore emulator connection failed (might be due to various reasons, check emulator status):", error);
  }
}


export { app, auth, db };
