import { useState, useCallback, useMemo, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Header } from './components/Header'
import { MenuGrid } from './components/MenuGrid'
import { AdminPanel } from './components/AdminPanel'
import { LoginDialog } from './components/LoginDialog'
import { Toaster } from './components/ui/sonner'
import { toast } from 'sonner'

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

function AppContent() {
  const [isAdmin, setIsAdmin] = useKV<boolean>("is-admin", false)
  const [menuItems, setMenuItems] = useKV<MenuItem[]>("menu-items", sampleMenuItems)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedMenuType, setSelectedMenuType] = useKV<MenuType>("selected-menu-type", 'dinein-ac')
  const [isDirectLink, setIsDirectLink] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  // Simple admin authentication with password
  const handleAdminLogin = useCallback((password: string) => {
    // Simple password check - in production, use proper authentication
    if (password === 'admin123') {
      setIsAdmin(true)
      setShowLoginDialog(false)
      toast.success('Admin access granted')
      return true
    } else {
      toast.error('Invalid admin password')
      return false
    }
  }, [setIsAdmin])

  const handleAdminLogout = useCallback(() => {
    setIsAdmin(false)
    toast.success('Admin logged out')
  }, [setIsAdmin])

  // Handle URL parameters to set menu type directly
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const menuParam = urlParams.get('menu') as MenuType
    
    if (menuParam && ['dinein-non-ac', 'dinein-ac', 'takeaway'].includes(menuParam)) {
      setSelectedMenuType(menuParam)
      setIsDirectLink(true)
      
      setTimeout(() => {
        const messages = {
          'dinein-non-ac': {
            title: 'Dine-in Non-AC Menu',
            description: 'Showing Non-AC pricing only'
          },
          'dinein-ac': {
            title: 'Dine-in AC Menu', 
            description: 'Showing AC pricing only'
          },
          'takeaway': {
            title: 'Takeaway Menu',
            description: 'Showing takeaway pricing only'
          }
        }
        
        const message = messages[menuParam]
        toast.success(message.title, {
          description: message.description
        })
      }, 500)
    }
  }, [setSelectedMenuType])

  const categories = useMemo(() => 
    ['all', ...Array.from(new Set(menuItems.map(item => item.category)))], 
    [menuItems]
  )

  const filteredItems = useMemo(() => 
    selectedCategory === 'all' 
      ? menuItems 
      : menuItems.filter(item => item.category === selectedCategory),
    [menuItems, selectedCategory]
  )

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

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isAdmin={isAdmin}
        onAdminLogin={() => setShowLoginDialog(true)}
        onAdminLogout={handleAdminLogout}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        menuType={selectedMenuType}
        onMenuTypeSelect={setSelectedMenuType}
        isDirectLink={isDirectLink}
        role="banner"
        aria-label="Restaurant header with menu navigation"
      />
      
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8" role="main" aria-label="Restaurant menu content">
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

      {showLoginDialog && (
        <LoginDialog 
          open={showLoginDialog}
          onOpenChange={setShowLoginDialog}
          onLogin={handleAdminLogin}
        />
      )}

      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            fontSize: '14px',
          },
          className: 'sm:text-base text-sm',
        }}
      />
    </div>
  )
}

function App() {
  return <AppContent />
}

export { getItemPrice }

export default App