import { ChefHat, UserCheck, LogOut, House, AirConditioner, Package, Palette } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { CategoryFilter } from './CategoryFilter'
import { MenuTypeSelector } from './MenuTypeSelector'
import { MenuType } from '../App'
import { toast } from 'sonner'
import { menuThemes } from '../hooks/useTheme'

interface HeaderProps {
  isAdmin: boolean
  onAdminLogin: () => void
  onAdminLogout: () => void
  categories: string[]
  selectedCategory: string
  onCategorySelect: (category: string) => void
  menuType: MenuType
  onMenuTypeSelect: (type: MenuType) => void
  isDirectLink: boolean
}

export function Header({ 
  isAdmin,
  onAdminLogin,
  onAdminLogout,
  categories, 
  selectedCategory, 
  onCategorySelect,
  menuType,
  onMenuTypeSelect,
  isDirectLink
}: HeaderProps) {



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
    <header className="bg-card border-b border-border sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <ChefHat size={28} className="text-primary flex-shrink-0 sm:size-8" />
            <div className="min-w-0 flex-1">
              <h1 className="font-display font-bold text-lg sm:text-2xl text-foreground truncate">
                Paradise Family Restaurant
              </h1>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <span className="hidden sm:block">Fine Dining Experience</span>
                <span className="flex items-center gap-1">
                  <Palette size={12} className="sm:size-3" />
                  <span className="font-medium text-primary">{menuThemes[menuType].name}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Hide admin controls when accessed via QR direct links */}
          {!isDirectLink && (
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {isAdmin ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                    <UserCheck size={16} />
                    Admin Access
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={onAdminLogout}
                    className="gap-1 sm:gap-2 px-2 sm:px-3"
                  >
                    <LogOut size={14} className="sm:size-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline"
                  onClick={onAdminLogin}
                  className="gap-1 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4"
                  size="sm"
                >
                  <UserCheck size={14} className="sm:size-4" />
                  <span className="hidden xs:inline">Admin Login</span>
                  <span className="xs:hidden">Login</span>
                </Button>
              )}
            </div>
          )}
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
                <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary-foreground rounded-md border border-primary/20 shadow-sm">
                  {getMenuTypeIcon(menuType)}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{getMenuTypeName(menuType)}</span>
                    <span className="text-xs opacity-75">{menuThemes[menuType].name} Theme</span>
                  </div>
                  <span className="text-xs opacity-75 hidden sm:inline ml-2">(QR Access)</span>
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
  )
}