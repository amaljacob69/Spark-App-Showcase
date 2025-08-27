// Firebase configuration and initialization
import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAuth, connectAuthEmulator } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAYuSiwMkEJoTeNrvmkmUGh0GovPrMACRg",
  authDomain: "paradise-family.firebaseapp.com",
  projectId: "paradise-family",
  storageBucket: "paradise-family.firebasestorage.app",
  messagingSenderId: "477641412672",
  appId: "1:477641412672:web:140084cd4275aab3b34fa5",
  measurementId: "G-XWQXEJXV71"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const db = getFirestore(app)
export const auth = getAuth(app)

// Configure emulators for development (only in development mode)
if (import.meta.env.DEV && !auth.emulatorConfig) {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
  } catch (error) {
    // Emulator might already be connected or not available
  }
}

if (import.meta.env.DEV && !db._delegate._databaseId.isDefaultDatabase) {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080)
  } catch (error) {
    // Emulator might already be connected or not available
  }
}

export { app }