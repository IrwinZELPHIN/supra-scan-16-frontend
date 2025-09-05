// Firebase configuration for SUPRA-CODE NEURO-PERFORMANCE™
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';

// Configuration Firebase - SUPRA-CODE NEURO-PERFORMANCE™
const firebaseConfig = {
  apiKey: "AIzaSyAFYTil7nvEUDvKayXa1vOEHJ3GSjDwlJM",
  authDomain: "supra-scan-app.firebaseapp.com",
  projectId: "supra-scan-app",
  storageBucket: "supra-scan-app.firebasestorage.app",
  messagingSenderId: "716208304035",
  appId: "1:716208304035:web:891a93f139d777ec437416",
  measurementId: "G-JKNNPP0TVF"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);

// Services Firebase
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);

export default app;

