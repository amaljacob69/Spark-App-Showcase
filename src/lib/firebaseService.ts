import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase'
import { MenuItem } from '../App'

const COLLECTION_NAME = 'menuItems'

// Convert Firebase document to MenuItem
const documentToMenuItem = (doc: any): MenuItem => {
  const data = doc.data()
  return {
    id: doc.id,
    name: data.name || '',
    description: data.description || '',
    prices: data.prices || {
      'dinein-non-ac': 0,
      'dinein-ac': 0,
      'takeaway': 0
    },
    category: data.category || 'Other',
    available: data.available ?? true,
    image: data.image,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  }
}

// Get all menu items
export const getAllMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('name'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(documentToMenuItem)
  } catch (error) {
    console.error('Error fetching menu items:', error)
    throw error
  }
}

// Add new menu item
export const addMenuItem = async (item: Omit<MenuItem, 'id'>): Promise<string> => {
  try {
    const docData = {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    const docRef = await addDoc(collection(db, COLLECTION_NAME), docData)
    return docRef.id
  } catch (error) {
    console.error('Error adding menu item:', error)
    throw error
  }
}

// Update menu item
export const updateMenuItem = async (id: string, updates: Partial<MenuItem>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    }
    await updateDoc(docRef, updateData)
  } catch (error) {
    console.error('Error updating menu item:', error)
    throw error
  }
}

// Delete menu item
export const deleteMenuItem = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id))
  } catch (error) {
    console.error('Error deleting menu item:', error)
    throw error
  }
}

// Real-time listener for menu items
export const subscribeToMenuItems = (callback: (items: MenuItem[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('name'))
  
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(documentToMenuItem)
    callback(items)
  }, (error) => {
    console.error('Error in menu items subscription:', error)
  })
}

// Initialize with sample data (call once to populate Firestore)
export const initializeSampleData = async (sampleItems: MenuItem[]): Promise<void> => {
  try {
    const existingItems = await getAllMenuItems()
    
    if (existingItems.length === 0) {
      console.log('Initializing Firestore with sample data...')
      const promises = sampleItems.map(item => {
        const { id, ...itemWithoutId } = item
        return addMenuItem(itemWithoutId)
      })
      await Promise.all(promises)
      console.log('Sample data initialized successfully')
    }
  } catch (error) {
    console.error('Error initializing sample data:', error)
  }
}