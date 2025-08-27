import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAYuSiwMkEJoTeNrvmkmUGh0GovPrMACRg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "paradise-family.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "paradise-family",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "paradise-family.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "477641412672",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:477641412672:web:140084cd4275aab3b34fa5",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XWQXEJXV71"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
export const db = getFirestore(app)

// Initialize Auth
export const auth = getAuth(app)

// Development emulator setup (optional)
if (import.meta.env.DEV && !import.meta.env.VITE_FIREBASE_EMULATOR_DISABLED) {
  // Connect to Firestore emulator if running in development
  try {
    connectFirestoreEmulator(db, 'localhost', 8080)
  } catch (error) {
    // Emulator already connected or not available
    console.log('Firestore emulator connection skipped')
  }
}

export default app