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
  price: number
  category: string
  available: boolean
  image?: string
}

function App() {
  const [menuItems, setMenuItems] = useKV<MenuItem[]>("menu-items", [])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
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
      />
      
      <main className="container mx-auto px-4 py-8">
        <MenuGrid 
          items={filteredItems}
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

export default App