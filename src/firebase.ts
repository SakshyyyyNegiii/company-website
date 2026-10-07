import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import fallbackConfig from '../firebase-applet-config.json';

// Safe accessor for valid config string
function getValidValue(envVal: string | undefined, fallbackVal: string): string {
  if (!envVal) return fallbackVal;
  const trimmed = envVal.trim();
  if (
    trimmed === '' ||
    trimmed === '2006' ||
    trimmed === 'undefined' ||
    trimmed === 'null' ||
    trimmed.startsWith('MY_')
  ) {
    return fallbackVal;
  }
  return trimmed;
}

// Read env variables safely if defined in browser or server
function getEnvVar(key: string): string | undefined {
  try {
    if (typeof import.meta !== 'undefined' && import.meta && import.meta.env) {
      return (import.meta.env as Record<string, string | undefined>)[key];
    }
  } catch {
    // ignore
  }
  try {
    if (typeof process !== 'undefined' && process && process.env) {
      return process.env[key];
    }
  } catch {
    // ignore
  }
  return undefined;
}

// Canonical Firebase configuration using provisioned applet credentials
export const firebaseConfig = {
  apiKey: getValidValue(getEnvVar('VITE_FIREBASE_API_KEY'), fallbackConfig.apiKey),
  authDomain: getValidValue(getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'), fallbackConfig.authDomain),
  projectId: getValidValue(getEnvVar('VITE_FIREBASE_PROJECT_ID'), fallbackConfig.projectId),
  storageBucket: getValidValue(getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'), fallbackConfig.storageBucket),
  messagingSenderId: getValidValue(getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'), fallbackConfig.messagingSenderId),
  appId: getValidValue(getEnvVar('VITE_FIREBASE_APP_ID'), fallbackConfig.appId),
};

// Initialize Firebase App as a singleton
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore database
const databaseId = getValidValue(
  getEnvVar('VITE_FIREBASE_FIRESTORE_DATABASE_ID'),
  fallbackConfig.firestoreDatabaseId
);

export const db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export default app;
