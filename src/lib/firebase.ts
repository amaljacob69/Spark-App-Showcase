import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import type { MenuItem } from '../App'

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

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

// Google Auth provider
const provider = new GoogleAuthProvider()

// Auth functions
export const signInWithGoogle = () => signInWithPopup(auth, provider)
export const logOut = () => signOut(auth)

// Menu items Firestore operations
export const saveMenuItems = async (menuItems: MenuItem[]) => {
  try {
    const menuRef = doc(db, 'restaurant', 'menu')
    await setDoc(menuRef, { items: menuItems, updatedAt: new Date() })
  } catch (error) {
    console.error('Error saving menu items:', error)
    throw error
  }
}

export const loadMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const menuRef = doc(db, 'restaurant', 'menu')
    const menuSnap = await getDoc(menuRef)
    
    if (menuSnap.exists()) {
      const data = menuSnap.data()
      return data.items || []
    }
    return []
  } catch (error) {
    console.error('Error loading menu items:', error)
    throw error
  }
}

// Admin user type
export interface AdminUser {
  email: string
  addedAt: Date
  isActive: boolean
}

// Admin users management
export const checkAdminAccess = async (email: string): Promise<boolean> => {
  try {
    const adminRef = doc(db, 'admins', email)
    const adminSnap = await getDoc(adminRef)
    
    if (adminSnap.exists()) {
      const data = adminSnap.data()
      return data.isActive === true
    }
    return false
  } catch (error) {
    console.error('Error checking admin access:', error)
    return false
  }
}

export const addAdminUser = async (email: string) => {
  try {
    const adminRef = doc(db, 'admins', email)
    await setDoc(adminRef, { 
      email, 
      addedAt: new Date(),
      isActive: true 
    })
  } catch (error) {
    console.error('Error adding admin user:', error)
    throw error
  }
}

export const removeAdminUser = async (email: string) => {
  try {
    const adminRef = doc(db, 'admins', email)
    await deleteDoc(adminRef)
  } catch (error) {
    console.error('Error removing admin user:', error)
    throw error
  }
}

export const getAdminUsers = async (): Promise<AdminUser[]> => {
  try {
    const adminsRef = collection(db, 'admins')
    const adminsSnap = await getDocs(adminsRef)
    
    return adminsSnap.docs.map(doc => {
      const data = doc.data()
      return {
        email: data.email,
        addedAt: data.addedAt?.toDate() || new Date(),
        isActive: data.isActive ?? true
      }
    })
  } catch (error) {
    console.error('Error getting admin users:', error)
    throw error
  }
}

export const toggleAdminStatus = async (email: string, isActive: boolean) => {
  try {
    const adminRef = doc(db, 'admins', email)
    await updateDoc(adminRef, { isActive })
  } catch (error) {
    console.error('Error toggling admin status:', error)
    throw error
  }
}

// Auth state observer
export const onAuthStateChange = onAuthStateChanged