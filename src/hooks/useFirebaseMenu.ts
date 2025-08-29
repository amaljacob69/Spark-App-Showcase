import { useState, useEffect } from 'react'
import { 
  getAllMenuItems, 
  addMenuItem, 
  updateMenuItem, 
  deleteMenuItem, 
  subscribeToMenuItems,
  initializeSampleData
} from '../lib/firebaseService'
import { MenuItem } from '@/types'
import { toast } from 'sonner'

interface UseFirebaseMenuReturn {
  menuItems: MenuItem[]
  loading: boolean
  error: string | null
  addItem: (item: Omit<MenuItem, 'id'>) => Promise<void>
  updateItem: (id: string, updates: Partial<MenuItem>) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  initializeData: (sampleItems: MenuItem[]) => Promise<void>
}

export const useFirebaseMenu = (fallbackData: MenuItem[] = []): UseFirebaseMenuReturn => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(fallbackData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let unsubscribe: (() => void) | null = null

    const setupFirebaseConnection = async () => {
      try {
        setLoading(true)
        setError(null)

        // Set up real-time listener
        unsubscribe = subscribeToMenuItems((items) => {
          setMenuItems(items)
          setLoading(false)
        })

        // If no items exist, initialize with sample data
        const items = await getAllMenuItems()
        if (items.length === 0 && fallbackData.length > 0) {
          await initializeSampleData(fallbackData)
        }

      } catch (err) {
        console.error('Firebase connection error:', err)
        setError(err instanceof Error ? err.message : 'Failed to connect to database')
        setLoading(false)
        // Fall back to local data
        setMenuItems(fallbackData)
        toast.error('Using offline mode', {
          description: 'Could not connect to database'
        })
      }
    }

    setupFirebaseConnection()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  const addItem = async (item: Omit<MenuItem, 'id'>) => {
    try {
      await addMenuItem(item)
      toast.success('Menu item added successfully')
    } catch (err) {
      console.error('Error adding item:', err)
      toast.error('Failed to add menu item')
      throw err
    }
  }

  const updateItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      await updateMenuItem(id, updates)
      toast.success('Menu item updated successfully')
    } catch (err) {
      console.error('Error updating item:', err)
      toast.error('Failed to update menu item')
      throw err
    }
  }

  const deleteItem = async (id: string) => {
    try {
      await deleteMenuItem(id)
      toast.success('Menu item deleted successfully')
    } catch (err) {
      console.error('Error deleting item:', err)
      toast.error('Failed to delete menu item')
      throw err
    }
  }

  const initializeData = async (sampleItems: MenuItem[]) => {
    try {
      await initializeSampleData(sampleItems)
      toast.success('Sample data initialized')
    } catch (err) {
      console.error('Error initializing data:', err)
      toast.error('Failed to initialize sample data')
      throw err
    }
  }

  return {
    menuItems,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    initializeData
  }
}