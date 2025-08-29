import { usePWA } from '@/hooks/usePWA'
import { useState, useCallback, useMemo, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Header } from './components/Header'
import { MenuGrid } from './components/MenuGrid'
import { AdminPanel } from './components/AdminPanel'
import ErrorBoundary from './components/ErrorBoundary'
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
import { PWAInstallPrompt, PWAStatusIndicator } from './components/PWAInstallPrompt'
import { Toaster } from './components/ui/sonner'
import { toast } from 'sonner'
import { useTheme } from './hooks/useTheme'
import { usePerformanceMonitoring } from './lib/performance'
import { useOfflineStatus } from './lib/offline'
import securityManager from './lib/security'
import offlineManager from './lib/offline'
import performanceMonitor from './lib/performance'
import config from './config/environment'
import './lib/errorHandler' // Initialize global error handling

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
  // Kerala Specialties
  {
    id: "1",
    name: "Kerala Fish Curry",
    description: "Traditional Kerala fish curry with coconut milk, curry leaves, and steamed rice",
    prices: {
      'dinein-non-ac': 220,
      'dinein-ac': 240,
      'takeaway': 200
    },
    category: "Kerala Cuisine",
    available: true,
    dietary: ["fish"]
  },
  {
    id: "2",
    name: "Chicken Biriyani Kerala Style",
    description: "Aromatic Kerala-style chicken biriyani with fragrant spices and basmati rice",
    prices: {
      'dinein-non-ac': 250,
      'dinein-ac': 280,
      'takeaway': 230
    },
    category: "Kerala Cuisine",
    available: true,
    dietary: ["chicken"]
  },
  {
    id: "3",
    name: "Kerala Beef Fry",
    description: "Spicy Kerala beef fry with coconut slices, curry leaves, and traditional spices",
    prices: {
      'dinein-non-ac': 180,
      'dinein-ac': 200,
      'takeaway': 160
    },
    category: "Kerala Cuisine",
    available: true,
    dietary: ["meat"]
  },
  // Arabic Specialties
  {
    id: "4",
    name: "Chicken Shawarma",
    description: "Authentic Arabic chicken shawarma with garlic sauce, pickles, and pita bread",
    prices: {
      'dinein-non-ac': 120,
      'dinein-ac': 140,
      'takeaway': 100
    },
    category: "Arabic Cuisine",
    available: true,
    dietary: ["chicken"]
  },
  {
    id: "5",
    name: "Arabic Mutton Kabsa",
    description: "Traditional Arabic rice dish with tender mutton, aromatic spices, and almonds",
    prices: {
      'dinein-non-ac': 320,
      'dinein-ac': 350,
      'takeaway': 290
    },
    category: "Arabic Cuisine",
    available: true,
    dietary: ["meat"]
  },
  {
    id: "6",
    name: "Hummus with Pita",
    description: "Creamy hummus served with warm pita bread, olive oil, and Arabic spices",
    prices: {
      'dinein-non-ac': 80,
      'dinein-ac': 90,
      'takeaway': 70
    },
    category: "Arabic Cuisine",
    available: true,
    dietary: ["vegetarian"]
  },
  // Chinese Specialties
  {
    id: "7", 
    name: "Chicken Fried Rice",
    description: "Wok-fried rice with tender chicken pieces, vegetables, and Chinese soy sauce",
    prices: {
      'dinein-non-ac': 160,
      'dinein-ac': 180,
      'takeaway': 140
    },
    category: "Chinese Cuisine",
    available: true,
    dietary: ["chicken"]
  },
  {
    id: "8",
    name: "Sweet & Sour Pork",
    description: "Crispy pork in traditional Chinese sweet and sour sauce with pineapple and peppers",
    prices: {
      'dinein-non-ac': 200,
      'dinein-ac': 220,
      'takeaway': 180
    },
    category: "Chinese Cuisine",
    available: true,
    dietary: ["meat"]
  },
  {
    id: "9",
    name: "Hakka Noodles",
    description: "Stir-fried noodles with mixed vegetables and Indo-Chinese flavors",
    prices: {
      'dinein-non-ac': 120,
      'dinein-ac': 140,
      'takeaway': 100
    },
    category: "Chinese Cuisine",
    available: true,
    dietary: ["vegetarian", "egg"]
  },
  {
    id: "10",
    name: "Chilli Chicken",
    description: "Spicy Indo-Chinese chicken with bell peppers, onions, and chili sauce",
    prices: {
      'dinein-non-ac': 180,
      'dinein-ac': 200,
      'takeaway': 160
    },
    category: "Chinese Cuisine",
    available: true,
    dietary: ["chicken"]
  },
  // Bakery Items
  {
    id: "11",
    name: "Fresh Croissants",
    description: "Buttery, flaky croissants baked fresh daily in our bakery",
    prices: {
      'dinein-non-ac': 40,
      'dinein-ac': 45,
      'takeaway': 35
    },
    category: "Bakery",
    available: true,
    dietary: ["vegetarian", "egg"]
  },
  {
    id: "12",
    name: "Chocolate Cake Slice",
    description: "Rich chocolate cake with chocolate ganache, baked fresh in our bakery",
    prices: {
      'dinein-non-ac': 80,
      'dinein-ac': 90,
      'takeaway': 70
    },
    category: "Bakery",
    available: true,
    dietary: ["vegetarian", "egg"]
  },
  {
    id: "13",
    name: "Garlic Bread",
    description: "Freshly baked garlic bread with herbs and butter from our bakery",
    prices: {
      'dinein-non-ac': 60,
      'dinein-ac': 70,
      'takeaway': 50
    },
    category: "Bakery",
    available: true,
    dietary: ["vegetarian"]
  },
  {
    id: "14",
    name: "Fruit Pastry",
    description: "Assorted fresh fruit pastries made daily in our bake shop",
    prices: {
      'dinein-non-ac': 70,
      'dinein-ac': 80,
      'takeaway': 60
    },
    category: "Bakery",
    available: true,
    dietary: ["vegetarian", "egg"]
  },
  // Additional Popular Items
  {
    id: "15",
    name: "Prawns Masala Kerala Style",
    description: "Fresh prawns in coconut-based Kerala curry with curry leaves and spices",
    prices: {
      'dinein-non-ac': 280,
      'dinein-ac': 310,
      'takeaway': 250
    },
    category: "Kerala Cuisine",
    available: true,
    dietary: ["fish"]
  },
  {
    id: "16",
    name: "Arabic Grilled Fish",
    description: "Fresh fish marinated in Arabic spices and grilled to perfection",
    prices: {
      'dinein-non-ac': 240,
      'dinein-ac': 260,
      'takeaway': 220
    },
    category: "Arabic Cuisine",
    available: true,
    dietary: ["fish"]
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
  const [loginAttempts, setLoginAttempts] = useState(0)
  
  // PWA functionality
  const { isInstalled, isInstallable, isOnline, installApp, updateAvailable, updateApp } = usePWA()
  
  // Production-ready hooks
  const { offlineStatus } = useOfflineStatus()
  const { startTiming } = usePerformanceMonitoring('AppContent')

  // Cart functionality
  const { cartItems, addToCart, updateQuantity, removeFromCart, clearCart, getCartItemCount } = useCart()

  // Apply theme based on selected menu type
  const currentTheme = useTheme(selectedMenuType || 'dinein-ac')

  // Ensure we have default values
  const safeMenuItems = menuItems || sampleMenuItems
  const safeSelectedMenuType = selectedMenuType || 'dinein-ac'
  const safeIsAdmin = isAdmin || false

  // Performance monitoring
  useEffect(() => {
    const endTiming = startTiming()
    
    return () => {
      if (endTiming) endTiming()
    }
  }, [startTiming])

  // Cache menu items for offline use
  useEffect(() => {
    if (safeMenuItems && safeMenuItems.length > 0) {
      offlineManager.cacheData('menu-items', safeMenuItems, 60) // Cache for 1 hour
    }
  }, [safeMenuItems])

  // Handle offline status changes
  useEffect(() => {
    const handleOffline = () => {
      toast.info('You are now offline. Some features may be limited.')
    }
    
    const handleOnline = () => {
      toast.success('You are back online!')
      // Sync any queued changes
      offlineManager.forcSync().catch(console.error)
    }

    window.addEventListener('app:offline', handleOffline)
    window.addEventListener('app:online', handleOnline)

    return () => {
      window.removeEventListener('app:offline', handleOffline)
      window.removeEventListener('app:online', handleOnline)
    }
  }, [])

  // Simulate loading for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  // Enhanced admin authentication with security
  const handleAdminLogin = useCallback((password: string) => {
    const identifier = 'admin-login'
    
    // Check if user has exceeded login attempts
    if (!securityManager.checkLoginAttempts(identifier)) {
      toast.error('Too many failed attempts. Please try again later.')
      return false
    }
    
    // Validate password
    const validation = securityManager.validatePassword(password)
    if (!validation.valid) {
      toast.error(validation.message || 'Invalid password')
      return false
    }
    
    // Check admin password (in production, use proper authentication)
    if (password === 'admin123') {
      securityManager.recordLoginAttempt(identifier, true)
      securityManager.refreshSession()
      setIsAdmin(true)
      setShowLoginDialog(false)
      setLoginAttempts(0)
      toast.success('Admin access granted')
      
      // Log successful admin login
      if (config.features.enableAnalytics) {
        performanceMonitor.recordMetric('admin_login_success', Date.now())
      }
      
      return true
    } else {
      securityManager.recordLoginAttempt(identifier, false)
      const newAttempts = loginAttempts + 1
      setLoginAttempts(newAttempts)
      
      toast.error(`Invalid password. ${config.security.maxLoginAttempts - newAttempts} attempts remaining.`)
      
      // Log failed admin login attempt
      if (config.features.enableAnalytics) {
        performanceMonitor.recordMetric('admin_login_failed', Date.now())
      }
      
      return false
    }
  }, [setIsAdmin, loginAttempts])

  const handleAdminLogout = useCallback(() => {
    setIsAdmin(false)
    setLoginAttempts(0)
    
    // Clear sensitive data
    securityManager.refreshSession()
    
    toast.success('Admin logged out')
    
    // Log admin logout
    if (config.features.enableAnalytics) {
      performanceMonitor.recordMetric('admin_logout', Date.now())
    }
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
    // Validate admin operation
    if (!securityManager.validateMenuOperation('create', item)) {
      return
    }
    
    try {
      // Sanitize input data
      const sanitizedItem = securityManager.sanitizeMenuItem(item)
      
      const newItem: MenuItem = {
        ...sanitizedItem,
        id: securityManager.generateSecureId()
      }
      
      setMenuItems(current => [...(current || []), newItem])
      
      // Queue for sync if offline
      if (!isOnline) {
        offlineManager.queueForSync('menu_create', newItem)
      }
      
      toast.success('Menu item added successfully')
      
      // Log menu item creation
      if (config.features.enableAnalytics) {
        performanceMonitor.recordMetric('menu_item_created', Date.now())
      }
      
    } catch (error) {
      console.error('Failed to add menu item:', error)
      toast.error('Failed to add menu item. Please check your input.')
    }
  }, [setMenuItems, isOnline])

  const handleEditItem = useCallback((id: string, updates: Partial<MenuItem>) => {
    // Validate admin operation
    if (!securityManager.validateMenuOperation('update', updates)) {
      return
    }
    
    try {
      // Sanitize update data
      const sanitizedUpdates = securityManager.sanitizeMenuItem(updates)
      
      setMenuItems(current => 
        (current || []).map(item => 
          item.id === id ? { ...item, ...sanitizedUpdates } : item
        )
      )
      
      // Queue for sync if offline
      if (!isOnline) {
        offlineManager.queueForSync('menu_update', { id, updates: sanitizedUpdates })
      }
      
      toast.success('Menu item updated successfully')
      
      // Log menu item update
      if (config.features.enableAnalytics) {
        performanceMonitor.recordMetric('menu_item_updated', Date.now())
      }
      
    } catch (error) {
      console.error('Failed to update menu item:', error)
      toast.error('Failed to update menu item. Please check your input.')
    }
  }, [setMenuItems, isOnline])

  const handleDeleteItem = useCallback((id: string) => {
    // Validate admin operation
    if (!securityManager.validateMenuOperation('delete')) {
      return
    }
    
    setMenuItems(current => (current || []).filter(item => item.id !== id))
    
    // Queue for sync if offline
    if (!isOnline) {
      offlineManager.queueForSync('menu_delete', { id })
    }
    
    toast.success('Menu item deleted successfully')
    
    // Log menu item deletion
    if (config.features.enableAnalytics) {
      performanceMonitor.recordMetric('menu_item_deleted', Date.now())
    }
  }, [setMenuItems, isOnline])

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
      .filter(item => item.available && (item.category === 'Kerala Cuisine' || item.category === 'Arabic Cuisine'))
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
                  setSelectedCategory('Kerala Cuisine')
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

      {/* PWA Install Prompt and Status */}
      <PWAInstallPrompt />
      <PWAStatusIndicator />
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AppContent />
      
      {/* PWA Install Prompt and Status - Outside main content for global access */}
      <PWAInstallPrompt />
      <PWAStatusIndicator />
    </ErrorBoundary>
  )
    </ErrorBoundary>
  )
}

export { getItemPrice }

export default App