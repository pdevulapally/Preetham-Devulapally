import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || "AIzaSyDr6xcvSmCXqH2XD-PxZeuBF3dXkdJRdHM",
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || "my-portfolio-b204e.firebaseapp.com",
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || "my-portfolio-b204e",
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || "my-portfolio-b204e.firebasestorage.app",
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "609036685786",
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || "1:609036685786:web:9b809a3d7e47d05d9730e3",
  measurementId: (import.meta as any).env?.VITE_FIREBASE_MEASUREMENT_ID || "G-V0CB9N0QLB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Analytics (only in browser environment and production)
export const analytics = typeof window !== 'undefined' && (import.meta as any).env?.PROD ? getAnalytics(app) : null;

export default app;
