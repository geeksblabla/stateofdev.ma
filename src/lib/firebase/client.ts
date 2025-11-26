import type { FirebaseOptions } from "firebase/app";
// Client-side Firebase initialization
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig: FirebaseOptions = {
  apiKey: String(import.meta.env.PUBLIC_FIREBASE_API_KEY ?? ""),
  authDomain: String(import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN ?? ""),
  projectId: String(import.meta.env.PUBLIC_FIREBASE_PROJECT_ID ?? ""),
  storageBucket: String(import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET ?? ""),
  messagingSenderId: String(import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? ""),
  appId: String(import.meta.env.PUBLIC_FIREBASE_APP_ID ?? "")
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
