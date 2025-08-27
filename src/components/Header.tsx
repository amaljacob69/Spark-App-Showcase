import { ChefHat, UserCheck, LogOut, House, AirConditioner, Package, Settings } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { CategoryFilter } from './CategoryFilter'
import { MenuTypeSelector } from './MenuTypeSelector'
import { AdminSettings } from './AdminSettings'
import { MenuType } from '../App'
import { useAuth } from './FirebaseAuthProvider'
import { signInWithGoogle, logOut } from '../lib/firebase'
import { toast } from 'sonner'
import { useState } from 'react'

interface HeaderProps {
  categories: string[]
  selectedCategory: string
  onCategorySelect: (category: string) => void
  menuType: MenuType
  onMenuTypeSelect: (type: MenuType) => void
  isDirectLink: boolean
}

export function Header({ 
  categories, 
  selectedCategory, 
  onCategorySelect,
  menuType,
  onMenuTypeSelect,
  isDirectLink
}: HeaderProps) {
  const { user, isAdmin } = useAuth()
  const [showAdminSettings, setShowAdminSettings] = useState(false)

  const handleLogin = async () => {
    try {
      const result = await signInWithGoogle()
      toast.success(`Welcome ${result.user.displayName || result.user.email}!`)
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Failed to sign in')
    }
  }

  const handleLogout = async () => {
    try {
      await logOut()
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to log out')
    }
  }

  const getMenuTypeIcon = (type: MenuType) => {
    switch (type) {
      case 'dinein-non-ac':
        return <House size={16} />
      case 'dinein-ac':
        return <AirConditioner size={16} />
      case 'takeaway':
        return <Package size={16} />
    }
  }

  const getMenuTypeName = (type: MenuType) => {
    switch (type) {
      case 'dinein-non-ac':
        return 'Dine-in Non-AC Menu'
      case 'dinein-ac':
        return 'Dine-in AC Menu'
      case 'takeaway':
        return 'Takeaway Menu'
    }
  }

  return (
    <>
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <ChefHat size={28} className="text-primary flex-shrink-0 sm:size-8" />
              <div className="min-w-0 flex-1">
                <h1 className="font-display font-bold text-lg sm:text-2xl text-foreground truncate">
                  Paradise Family Restaurant
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Fine Dining Experience</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {user ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  {user.photoURL && (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User'} 
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0"
                    />
                  )}
                  <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                    <UserCheck size={16} />
                    {isAdmin ? 'Admin' : 'User'}: {user.displayName || user.email}
                  </div>
                  {isAdmin && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowAdminSettings(true)}
                      className="gap-1 sm:gap-2 px-2 sm:px-3"
                    >
                      <Settings size={14} className="sm:size-4" />
                      <span className="hidden sm:inline">Settings</span>
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleLogout}
                    className="gap-1 sm:gap-2 px-2 sm:px-3"
                  >
                    <LogOut size={14} className="sm:size-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline"
                  onClick={handleLogin}
                  className="gap-1 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4"
                  size="sm"
                >
                  <UserCheck size={14} className="sm:size-4" />
                  <span className="hidden xs:inline">Admin Login</span>
                  <span className="xs:hidden">Login</span>
                </Button>
              )}
            </div>
          </div>

          <div className="mt-3 sm:mt-4 flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Only show menu type selector if not accessing via direct QR link */}
            {!isDirectLink && (
              <div className="order-2 lg:order-1">
                <MenuTypeSelector 
                  selectedType={menuType}
                  onTypeSelect={onMenuTypeSelect}
                />
              </div>
            )}
            {/* Show fixed menu type indicator for QR code direct access */}
            {isDirectLink && (
              <div className="order-2 lg:order-1">
                <div className="flex items-center gap-2 px-3 py-2 bg-accent/10 text-accent-foreground rounded-md border">
                  {getMenuTypeIcon(menuType)}
                  <span className="text-sm font-medium">{getMenuTypeName(menuType)}</span>
                  <span className="text-xs opacity-75 hidden sm:inline">(QR Access)</span>
                </div>
              </div>
            )}
            <div className="order-1 lg:order-2">
              <CategoryFilter 
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={onCategorySelect}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Admin Settings Modal */}
      {showAdminSettings && (
        <AdminSettings onClose={() => setShowAdminSettings(false)} />
      )}
    </>
  )
}