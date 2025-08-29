import { useState, useCallback, useMemo, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Header } from './components/Header'
import { MenuGrid } from './components/MenuGrid'
import { AdminPanel } from './components/AdminPanel'

import { LoginDialog } from './components/LoginDialog'
import { ThemePreview } from './components/ThemePreview'
import { DietaryFilter, type DietaryPreference } from './components/DietaryFilter'
import { AdvancedSearch } from './components/AdvancedSearch'
import { FloatingActionButton } from './components/FloatingActionButton'
import { CartDialog, useCart } from './components/CartDialog'
import { OffersSection } from './components/OffersSection'
import { FeaturedMenuSection, PopularMenuSection } from './components/HorizontalMenuSection'
import { LoadingSkeleton } from './components/LoadingSkeleton'
import { Footer } from './components/Footer'
import { Toaster } from './components/ui/sonner'
import { toast } from 'sonner'
import { useTheme } from './hooks/useTheme'

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
  dietary: DietaryPreference[]
}

export type MenuType = 'dinein-non-ac' | 'dinein-ac' | 'takeaway'

export interface MenuPricing {
  'dinein-non-ac': number
  'dinein-ac': number
  'takeaway': number
}

const sampleMenuItems: MenuItem[] = [
  // Chicken Dishes
  {
    id: "1",
    name: "Grilled Chicken Breast",
    description: "Herb-marinated chicken breast with rosemary potatoes and seasonal vegetables",
    prices: {
      'dinein-non-ac': 18,
      'dinein-ac': 20,
      'takeaway': 16
    },
    category: "Chicken",
    available: true,
    dietary: ["chicken"]
  },
  {
    id: "2",
    name: "Chicken Tikka Masala",
    description: "Tender chicken in rich tomato-based curry sauce with basmati rice and naan",
    prices: {
      'dinein-non-ac': 22,
      'dinein-ac': 24,
      'takeaway': 20
    },
    category: "Chicken",
    available: true,
    dietary: ["chicken"]
  },
  {
    id: "3",
    name: "Buffalo Chicken Wings",
    description: "Crispy wings tossed in spicy buffalo sauce with celery sticks and blue cheese dip",
    prices: {
      'dinein-non-ac': 15,
      'dinein-ac': 17,
      'takeaway': 13
    },
    category: "Chicken",
    available: true,
    dietary: ["chicken"]
  },
  // Meat Dishes
  {
    id: "4",
    name: "Wagyu Beef Tenderloin",
    description: "Premium wagyu with roasted fingerling potatoes, seasonal vegetables, and red wine jus",
    prices: {
      'dinein-non-ac': 43,
      'dinein-ac': 48,
      'takeaway': 38
    },
    category: "Meat",
    available: true,
    dietary: ["meat"]
  },
  {
    id: "5",
    name: "Lamb Rack with Mint Sauce",
    description: "New Zealand lamb rack with herb crust, mint sauce, and roasted root vegetables",
    prices: {
      'dinein-non-ac': 38,
      'dinein-ac': 42,
      'takeaway': 34
    },
    category: "Meat",
    available: true,
    dietary: ["meat"]
  },
  {
    id: "6",
    name: "Pork Belly Confit",
    description: "Slow-cooked pork belly with apple compote, mashed potatoes, and crispy crackling",
    prices: {
      'dinein-non-ac': 26,
      'dinein-ac': 28,
      'takeaway': 24
    },
    category: "Meat",
    available: true,
    dietary: ["meat"]
  },
  // Fish & Seafood
  {
    id: "7", 
    name: "Pan-Seared Salmon",
    description: "Atlantic salmon with lemon herb butter, roasted vegetables, and quinoa pilaf",
    prices: {
      'dinein-non-ac': 29,
      'dinein-ac': 32,
      'takeaway': 26
    },
    category: "Fish",
    available: true,
    dietary: ["fish"]
  },
  {
    id: "8",
    name: "Grilled Sea Bass",
    description: "Mediterranean sea bass with olive tapenade, cherry tomatoes, and lemon risotto",
    prices: {
      'dinein-non-ac': 32,
      'dinein-ac': 35,
      'takeaway': 29
    },
    category: "Fish",
    available: true,
    dietary: ["fish"]
  },
  {
    id: "9",
    name: "Lobster Thermidor",
    description: "Fresh lobster in creamy cognac sauce, gratinated with cheese and herbs",
    prices: {
      'dinein-non-ac': 45,
      'dinein-ac': 50,
      'takeaway': 40
    },
    category: "Fish",
    available: true,
    dietary: ["fish"]
  },
  {
    id: "10",
    name: "Fish & Chips",
    description: "Beer-battered cod with hand-cut chips, mushy peas, and tartar sauce",
    prices: {
      'dinein-non-ac': 19,
      'dinein-ac': 21,
      'takeaway': 17
    },
    category: "Fish",
    available: true,
    dietary: ["fish"]
  },
  // Vegetarian & Other Categories
  {
    id: "11",
    name: "Truffle Risotto",
    description: "Creamy Arborio rice with wild mushrooms, black truffle shavings, and aged Parmesan",
    prices: {
      'dinein-non-ac': 25,
      'dinein-ac': 28,
      'takeaway': 22
    },
    category: "Vegetarian",
    available: true,
    dietary: ["vegetarian"]
  },
  {
    id: "12",
    name: "Burrata Caprese",
    description: "Fresh burrata cheese with heirloom tomatoes, basil oil, and balsamic reduction",
    prices: {
      'dinein-non-ac': 16,
      'dinein-ac': 18,
      'takeaway': 14
    },
    category: "Appetizers",
    available: true,
    dietary: ["vegetarian"]
  },
  {
    id: "13",
    name: "Craft Caesar Salad",
    description: "Crisp romaine lettuce, house-made croutons, aged Parmesan, and garlic aioli",
    prices: {
      'dinein-non-ac': 13,
      'dinein-ac': 14,
      'takeaway': 11
    },
    category: "Salads",
    available: true,
    dietary: ["vegetarian", "egg"]
  },
  {
    id: "14",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, vanilla bean ice cream, and berry coulis",
    prices: {
      'dinein-non-ac': 11,
      'dinein-ac': 12,
      'takeaway': 10
    },
    category: "Desserts",
    available: true,
    dietary: ["vegetarian", "egg"]
  },
  // Additional items to showcase variety
  {
    id: "15",
    name: "Chicken Carbonara",
    description: "Creamy pasta with grilled chicken, bacon, parmesan, and fresh herbs",
    prices: {
      'dinein-non-ac': 20,
      'dinein-ac': 22,
      'takeaway': 18
    },
    category: "Pasta",
    available: true,
    dietary: ["chicken", "egg", "meat"]
  },
  {
    id: "16",
    name: "Vegetable Spring Rolls",
    description: "Crispy spring rolls filled with fresh vegetables, served with sweet and sour sauce",
    prices: {
      'dinein-non-ac': 12,
      'dinein-ac': 13,
      'takeaway': 10
    },
    category: "Appetizers",
    available: true,
    dietary: ["vegetarian"]
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
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedDietaryFilters, setSelectedDietaryFilters] = useKV<DietaryPreference[]>('dietary-filters', [])
  const [showCartDialog, setShowCartDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Cart functionality
  const { cartItems, addToCart, updateQuantity, removeFromCart, clearCart, getCartItemCount } = useCart()

  // Apply theme based on selected menu type
  const currentTheme = useTheme(selectedMenuType || 'dinein-ac')

  // Ensure we have default values
  const safeMenuItems = menuItems || sampleMenuItems
  const safeSelectedMenuType = selectedMenuType || 'dinein-ac'
  const safeIsAdmin = isAdmin || false

  // Simulate loading for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

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
            title: 'Dine-in A/C Menu', 
            description: 'Showing A/C pricing only'
          },
          'takeaway': {
            title: 'Take Away Menu',
            description: 'Showing take away pricing only'
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
    ['all', ...Array.from(new Set(safeMenuItems.map(item => item.category)))], 
    [safeMenuItems]
  )

  const filteredItems = useMemo(() => {
    let items = safeMenuItems

    // Filter by category
    if (selectedCategory !== 'all') {
      items = items.filter(item => item.category === selectedCategory)
    }

    // Filter by dietary preferences
    if (selectedDietaryFilters && selectedDietaryFilters.length > 0) {
      items = items.filter(item => {
        // Item must have at least one of the selected dietary preferences
        return selectedDietaryFilters.some(filter => 
          item.dietary && item.dietary.includes(filter)
        )
      })
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      items = items.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (item.dietary && item.dietary.some(d => d.toLowerCase().includes(query)))
      )
    }

    return items
  }, [safeMenuItems, selectedCategory, selectedDietaryFilters, searchQuery])

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
      dietary: item.dietary || [],
      id: Date.now().toString()
    }
    setMenuItems(current => [...(current || []), newItem])
  }, [setMenuItems])

  const handleEditItem = useCallback((id: string, updates: Partial<MenuItem>) => {
    setMenuItems(current => 
      (current || []).map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    )
  }, [setMenuItems])

  const handleDeleteItem = useCallback((id: string) => {
    setMenuItems(current => (current || []).filter(item => item.id !== id))
  }, [setMenuItems])

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category)
    // Clear search and dietary filters when changing categories for better UX
    if (searchQuery) {
      setSearchQuery('')
    }
    if (selectedDietaryFilters && selectedDietaryFilters.length > 0) {
      setSelectedDietaryFilters([])
    }
  }, [searchQuery, selectedDietaryFilters, setSelectedDietaryFilters])

  const handleAddToCart = useCallback((item: MenuItem, menuType: MenuType) => {
    addToCart(item, menuType, 1)
  }, [addToCart])

  const handleCartClick = useCallback(() => {
    setShowCartDialog(true)
  }, [])

  // Get featured and popular items for horizontal sections
  const featuredItems = useMemo(() => {
    return safeMenuItems
      .filter(item => item.available && (item.category === 'Chicken' || item.category === 'Fish'))
      .slice(0, 6)
  }, [safeMenuItems])

  const popularItems = useMemo(() => {
    // Simulate popular items based on price and category
    return safeMenuItems
      .filter(item => item.available)
      .sort((a, b) => getItemPrice(b, safeSelectedMenuType) - getItemPrice(a, safeSelectedMenuType))
      .slice(0, 6)
  }, [safeMenuItems, safeSelectedMenuType])

  const showHorizontalSections = !searchQuery && 
    (!selectedDietaryFilters || selectedDietaryFilters.length === 0) && 
    selectedCategory === 'all' && 
    !safeIsAdmin

  // Show loading state on first load
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background safe-area-top safe-area-bottom">
        <ThemePreview menuType={safeSelectedMenuType} />
        
        {/* Header Loading */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50">
          <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4">
            <LoadingSkeleton type="header" />
          </div>
        </div>

        {/* Content Loading */}
        <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div className="space-y-6">
            <LoadingSkeleton type="text" count={2} />
            <LoadingSkeleton type="menu-grid" count={8} />
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  // Show Admin Dashboard if admin is logged in
  if (safeIsAdmin) {
    return (
      <div className="min-h-screen bg-background safe-area-top safe-area-bottom">
        <ThemePreview menuType={safeSelectedMenuType} />
        
        <Header 
          isAdmin={safeIsAdmin}
          onAdminLogin={() => setShowLoginDialog(true)}
          onAdminLogout={handleAdminLogout}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          menuType={safeSelectedMenuType}
          onMenuTypeSelect={setSelectedMenuType}
          isDirectLink={isDirectLink}
          onSearch={setSearchQuery}
          searchQuery={searchQuery}
        />
        
        <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div className="space-y-6">
            <AdminPanel onAddItem={handleAddItem} />
            
            <MenuGrid 
              items={filteredItems}
              menuType={safeSelectedMenuType}
              getItemPrice={getItemPrice}
              isAdmin={safeIsAdmin}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
            />
          </div>
        </main>

        <Footer />

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

  return (
    <div className="min-h-screen bg-background safe-area-top safe-area-bottom">
      <ThemePreview menuType={safeSelectedMenuType} />
      <Header 
        isAdmin={safeIsAdmin}
        onAdminLogin={() => safeIsAdmin ? {} : setShowLoginDialog(true)}
        onAdminLogout={handleAdminLogout}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
        menuType={safeSelectedMenuType}
        onMenuTypeSelect={setSelectedMenuType}
        isDirectLink={isDirectLink}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
      />
      
      <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8" role="main" aria-label="Restaurant menu content">
        {/* Special Offers Section */}
        <OffersSection isAdmin={safeIsAdmin} menuType={safeSelectedMenuType} />

        {/* Advanced Search and Filter Results Display */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <AdvancedSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedFilters={selectedDietaryFilters || []}
            onFiltersChange={setSelectedDietaryFilters}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategorySelect}
            totalItems={safeMenuItems.length}
            filteredItemsCount={filteredItems.length}
          />
        </div>

        {/* Enhanced Dietary Filters */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <DietaryFilter
            selectedFilters={selectedDietaryFilters || []}
            onFiltersChange={setSelectedDietaryFilters}
          />
        </div>

        {/* Featured and Popular Sections - only when no filters active */}
        {showHorizontalSections && (
          <div className="space-y-8 sm:space-y-10 lg:space-y-12 mb-8 sm:mb-10 lg:mb-12">
            {featuredItems.length > 0 && (
              <FeaturedMenuSection
                items={featuredItems}
                menuType={safeSelectedMenuType}
                getItemPrice={getItemPrice}
                onAddToCart={handleAddToCart}
                maxItems={6}
                onViewAll={() => {
                  setSelectedCategory('Chicken')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              />
            )}
            
            {popularItems.length > 0 && (
              <PopularMenuSection
                items={popularItems}
                menuType={safeSelectedMenuType}
                getItemPrice={getItemPrice}
                onAddToCart={handleAddToCart}
                maxItems={6}
                onViewAll={() => {
                  setSelectedCategory('all')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              />
            )}
          </div>
        )}
        
        <MenuGrid 
          items={filteredItems}
          menuType={safeSelectedMenuType}
          getItemPrice={getItemPrice}
          isAdmin={safeIsAdmin}
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItem}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          onAddToCart={!safeIsAdmin ? handleAddToCart : undefined}
        />
        
        {safeIsAdmin && (
          <div className="mt-8 sm:mt-10 lg:mt-12 space-y-6">
            <AdminPanel onAddItem={handleAddItem} />
          </div>
        )}
      </main>

      <Footer />

      {/* Floating Action Button - only show for non-admin users */}
      {!safeIsAdmin && (
        <FloatingActionButton
          cartItemCount={getCartItemCount()}
          onCartClick={handleCartClick}
        />
      )}

      {/* Cart Dialog */}
      <CartDialog
        open={showCartDialog}
        onOpenChange={setShowCartDialog}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
      />

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