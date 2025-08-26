import { useState, useCallback, useMemo, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Header } from './components/Header'
import { MenuGrid } from './components/MenuGrid'
import { AdminPanel } from './components/AdminPanel'
import { LoginDialog } from './components/LoginDialog'
import { Toaster } from './components/ui/sonner'

export interface MenuItem {
  id: string
  name: string
  description: string
  prices: {
    'dinein-non-ac': number
    'dinein-ac': number
    'takeaway': number
  }
  category: string
  available: boolean
  image?: string
}

export type MenuType = 'dinein-non-ac' | 'dinein-ac' | 'takeaway'

export interface MenuPricing {
  'dinein-non-ac': number
  'dinein-ac': number
  'takeaway': number
}

const sampleMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Truffle Risotto",
    description: "Creamy Arborio rice with wild mushrooms, black truffle shavings, and aged Parmesan",
    prices: {
      'dinein-non-ac': 25,
      'dinein-ac': 28,
      'takeaway': 22
    },
    category: "Mains",
    available: true
  },
  {
    id: "2", 
    name: "Pan-Seared Salmon",
    description: "Atlantic salmon with lemon herb butter, roasted vegetables, and quinoa pilaf",
    prices: {
      'dinein-non-ac': 29,
      'dinein-ac': 32,
      'takeaway': 26
    },
    category: "Mains",
    available: true
  },
  {
    id: "3",
    name: "Burrata Caprese",
    description: "Fresh burrata cheese with heirloom tomatoes, basil oil, and balsamic reduction",
    prices: {
      'dinein-non-ac': 16,
      'dinein-ac': 18,
      'takeaway': 14
    },
    category: "Appetizers",
    available: true
  },
  {
    id: "4",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, vanilla bean ice cream, and berry coulis",
    prices: {
      'dinein-non-ac': 11,
      'dinein-ac': 12,
      'takeaway': 10
    },
    category: "Desserts",
    available: true
  },
  {
    id: "5",
    name: "Craft Caesar Salad",
    description: "Crisp romaine lettuce, house-made croutons, aged Parmesan, and garlic aioli",
    prices: {
      'dinein-non-ac': 13,
      'dinein-ac': 14,
      'takeaway': 11
    },
    category: "Salads",
    available: true
  },
  {
    id: "6",
    name: "Wagyu Beef Tenderloin",
    description: "Premium wagyu with roasted fingerling potatoes, seasonal vegetables, and red wine jus",
    prices: {
      'dinein-non-ac': 43,
      'dinein-ac': 48,
      'takeaway': 38
    },
    category: "Mains",
    available: true
  }
]

const getItemPrice = (item: MenuItem, menuType: MenuType): number => {
  if (!item?.prices || typeof item.prices[menuType] !== 'number' || isNaN(item.prices[menuType])) {
    return 0
  }
  return item.prices[menuType]
}

function App() {
  const [menuItems, setMenuItems] = useKV<MenuItem[]>("menu-items", sampleMenuItems)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedMenuType, setSelectedMenuType] = useKV<MenuType>("selected-menu-type", 'dinein-ac')
  const [isAdmin, setIsAdmin] = useKV<boolean>("admin-session", false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [isDirectLink, setIsDirectLink] = useState(false)

  // Handle URL parameters to set menu type directly
  // Example URLs:
  // - ?menu=dinein-non-ac (Direct link to Non-AC menu - locks menu type)
  // - ?menu=dinein-ac (Direct link to AC menu)  
  // - ?menu=takeaway (Direct link to Takeaway menu)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const menuParam = urlParams.get('menu') as MenuType
    
    if (menuParam && ['dinein-non-ac', 'dinein-ac', 'takeaway'].includes(menuParam)) {
      setSelectedMenuType(menuParam)
      
      // If accessing dine-in non-AC directly, lock the menu type
      if (menuParam === 'dinein-non-ac') {
        setIsDirectLink(true)
        setTimeout(() => {
          // Only import toast dynamically to avoid issues
          import('sonner').then(({ toast }) => {
            toast.success('Viewing Dine-in Non-AC Menu', {
              description: 'Showing Non-AC pricing only'
            })
          })
        }, 500)
      }
    }
  }, [])

  // Memoize categories to avoid recalculation on every render
  const categories = useMemo(() => 
    ['all', ...Array.from(new Set(menuItems.map(item => item.category)))], 
    [menuItems]
  )

  // Memoize filtered items to avoid recalculation on every render
  const filteredItems = useMemo(() => 
    selectedCategory === 'all' 
      ? menuItems 
      : menuItems.filter(item => item.category === selectedCategory),
    [menuItems, selectedCategory]
  )

  // Memoize handlers to prevent unnecessary re-renders
  const handleAddItem = useCallback((item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      name: item.name || '',
      description: item.description || '',
      prices: item.prices || {
        'dinein-non-ac': 0,
        'dinein-ac': 0,
        'takeaway': 0
      },
      category: item.category || 'Other',
      available: item.available ?? true,
      id: Date.now().toString()
    }
    setMenuItems(current => [...current, newItem])
  }, [setMenuItems])

  const handleEditItem = useCallback((id: string, updates: Partial<MenuItem>) => {
    setMenuItems(current => 
      current.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    )
  }, [setMenuItems])

  const handleDeleteItem = useCallback((id: string) => {
    setMenuItems(current => current.filter(item => item.id !== id))
  }, [setMenuItems])

  const handleLogin = useCallback(() => {
    setIsAdmin(true)
    setShowLoginDialog(false)
  }, [setIsAdmin])

  const handleLogout = useCallback(() => {
    setIsAdmin(false)
  }, [setIsAdmin])

  const handleShowLoginDialog = useCallback(() => {
    setShowLoginDialog(true)
  }, [])

  const handleCloseLoginDialog = useCallback((open: boolean) => {
    setShowLoginDialog(open)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isAdmin={isAdmin}
        onLogin={handleShowLoginDialog}
        onLogout={handleLogout}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        menuType={selectedMenuType}
        onMenuTypeSelect={setSelectedMenuType}
        isDirectLink={isDirectLink}
        role="banner"
        aria-label="Restaurant header with menu navigation"
      />
      
      <main className="container mx-auto px-4 py-8" role="main" aria-label="Restaurant menu content">
        <MenuGrid 
          items={filteredItems}
          menuType={selectedMenuType}
          getItemPrice={getItemPrice}
          isAdmin={isAdmin}
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItem}
        />
        
        {isAdmin && (
          <AdminPanel onAddItem={handleAddItem} />
        )}
      </main>

      <LoginDialog 
        open={showLoginDialog}
        onOpenChange={handleCloseLoginDialog}
        onLogin={handleLogin}
      />

      <Toaster />
    </div>
  )
}

export { getItemPrice }

export default App