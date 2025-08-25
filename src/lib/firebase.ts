import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

import { FirestoreError } from 'firebase/firestore';
import { translations } from './translations';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export function handleFirestoreError(error: unknown, lang: 'pl' | 'en'): string {
  if (error instanceof Error) {
    const firestoreError = error as FirestoreError;
    
    switch (firestoreError.code) {
      case 'permission-denied':
        return translations[lang].firebaseErrors.permissionDenied;
      case 'not-found':
        return translations[lang].firebaseErrors.notFound;
      case 'already-exists':
        return translations[lang].firebaseErrors.alreadyExists;
      case 'unauthenticated':
        return translations[lang].firebaseErrors.unauthenticated;
      default:
        return translations[lang].firebaseErrors.default;
    }
  }

  return translations[lang].errors.unexpected;
};

export default app;
