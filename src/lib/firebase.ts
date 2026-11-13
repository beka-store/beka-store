import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const FIREBASE_CONFIG = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

export const isFirebaseConfigured = Boolean(FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId);

interface FirebaseServices {
  auth: Auth;
  db: Firestore;
}

let services: FirebaseServices | null = null;

export function getFirebase(): FirebaseServices {
  if (!services) {
    if (!isFirebaseConfigured) throw new Error('Firebase is not configured');
    const app: FirebaseApp = getApps()[0] ?? initializeApp(FIREBASE_CONFIG);
    services = { auth: getAuth(app), db: getFirestore(app) };
  }
  return services;
}
