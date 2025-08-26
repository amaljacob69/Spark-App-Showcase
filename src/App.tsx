import { useState } from 'react'
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
  basePrice: number
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
    basePrice: 28,
    category: "Mains",
    available: true
  },
  {
    id: "2", 
    name: "Pan-Seared Salmon",
    description: "Atlantic salmon with lemon herb butter, roasted vegetables, and quinoa pilaf",
    basePrice: 32,
    category: "Mains",
    available: true
  },
  {
    id: "3",
    name: "Burrata Caprese",
    description: "Fresh burrata cheese with heirloom tomatoes, basil oil, and balsamic reduction",
    basePrice: 18,
    category: "Appetizers",
    available: true
  },
  {
    id: "4",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, vanilla bean ice cream, and berry coulis",
    basePrice: 12,
    category: "Desserts",
    available: true
  },
  {
    id: "5",
    name: "Craft Caesar Salad",
    description: "Crisp romaine lettuce, house-made croutons, aged Parmesan, and garlic aioli",
    basePrice: 14,
    category: "Salads",
    available: true
  },
  {
    id: "6",
    name: "Wagyu Beef Tenderloin",
    description: "Premium wagyu with roasted fingerling potatoes, seasonal vegetables, and red wine jus",
    basePrice: 48,
    category: "Mains",
    available: true
  }
]

// Price multipliers for different menu types
const PRICE_MULTIPLIERS = {
  'dinein-non-ac': 0.9,  // 10% discount for non-AC dining
  'dinein-ac': 1.0,      // Base price for AC dining
  'takeaway': 0.8        // 20% discount for takeaway
}

const getItemPrice = (basePrice: number, menuType: MenuType): number => {
  return Math.round(basePrice * PRICE_MULTIPLIERS[menuType])
}

function App() {
  const [menuItems, setMenuItems] = useKV<MenuItem[]>("menu-items", sampleMenuItems)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedMenuType, setSelectedMenuType] = useKV<MenuType>("selected-menu-type", 'dinein-ac')
  const [isAdmin, setIsAdmin] = useKV<boolean>("admin-session", false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  const categories = ['all', ...Array.from(new Set(menuItems.map(item => item.category)))]

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory)

  const handleAddItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: Date.now().toString()
    }
    setMenuItems(current => [...current, newItem])
  }

  const handleEditItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(current => 
      current.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    )
  }

  const handleDeleteItem = (id: string) => {
    setMenuItems(current => current.filter(item => item.id !== id))
  }

  const handleLogin = () => {
    setIsAdmin(true)
    setShowLoginDialog(false)
  }

  const handleLogout = () => {
    setIsAdmin(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isAdmin={isAdmin}
        onLogin={() => setShowLoginDialog(true)}
        onLogout={handleLogout}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        menuType={selectedMenuType}
        onMenuTypeSelect={setSelectedMenuType}
      />
      
      <main className="container mx-auto px-4 py-8">
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
        onOpenChange={setShowLoginDialog}
        onLogin={handleLogin}
      />

      <Toaster />
    </div>
  )
}

export { getItemPrice, PRICE_MULTIPLIERS }

export default App