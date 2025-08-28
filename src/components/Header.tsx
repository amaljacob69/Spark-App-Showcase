import { ChefHat, UserCheck, SignOut, House, Snowflake, Package, Palette } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { CategoryFilter } from './CategoryFilter'
import { MenuTypeSelector } from './MenuTypeSelector'
import { SearchBar } from './SearchBar'
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
  onSearch: (query: string) => void
  searchQuery: string
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
  isDirectLink,
  onSearch,
  searchQuery
}: HeaderProps) {

  const getMenuTypeIcon = (type: MenuType) => {
    switch (type) {
      case 'dinein-non-ac':
        return <House size={16} />
      case 'dinein-ac':
        return <Snowflake size={16} />
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
    <header className="bg-card/80 backdrop-blur-lg border-b border-border/50 sticky top-0 z-50 theme-transition safe-area-top">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        {/* Top row with branding and admin controls */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="relative">
              <ChefHat size={28} className="text-primary flex-shrink-0 sm:size-8 drop-shadow-sm" />
              <div className="absolute -inset-1 bg-primary/20 rounded-full blur-sm -z-10 animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-display font-bold text-lg sm:text-2xl xl:text-3xl text-foreground truncate text-balance">
                Paradise Family Restaurant
              </h1>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <span className="hidden sm:block">Fine Dining Experience</span>
                <div className="flex items-center gap-1">
                  <Palette size={12} className="sm:size-3" />
                  <span className="font-medium text-primary">{menuThemes[menuType].name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin controls - hidden on direct links */}
          {!isDirectLink && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {isAdmin ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground px-2 py-1 bg-green-50 rounded-md border border-green-200">
                    <UserCheck size={16} className="text-green-600" />
                    <span className="text-green-700">Admin Access</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={onAdminLogout}
                    className="gap-1 sm:gap-2 px-3 sm:px-4 touch-target-sm hover-lift transition-all duration-200"
                  >
                    <SignOut size={14} className="sm:size-4" />
                    <span className="hidden sm:inline">Logout</span>
                    <span className="sm:hidden">Out</span>
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline"
                  onClick={onAdminLogin}
                  className="gap-1 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 touch-target hover-lift"
                  size="sm"
                >
                  <UserCheck size={14} className="sm:size-4" />
                  <span className="hidden sm:inline">Admin Login</span>
                  <span className="sm:hidden">Login</span>
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Search bar - full width on mobile */}
        <div className="mb-3 sm:mb-4">
          <SearchBar 
            onSearch={onSearch}
            className="w-full max-w-2xl mx-auto"
            placeholder="Search dishes, ingredients, categories, or dietary options..."
          />
        </div>

        {/* Menu type and category controls */}
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Menu type selector/indicator */}
          {!isDirectLink ? (
            <div className="order-1">
              <MenuTypeSelector 
                selectedType={menuType}
                onTypeSelect={onMenuTypeSelect}
              />
            </div>
          ) : (
            <div className="order-1">
              <div className="flex items-center justify-center sm:justify-start">
                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary/10 to-primary/5 text-primary rounded-lg border border-primary/20 shadow-sm">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/20 rounded-full">
                    {getMenuTypeIcon(menuType)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{getMenuTypeName(menuType)}</span>
                    <span className="text-xs opacity-75">
                      {menuType === 'dinein-non-ac' ? 'Cozy Warmth Theme • QR Access' : 
                       menuType === 'dinein-ac' ? 'Cool Elegance Theme • QR Access' : 
                       'Fresh Vitality Theme • QR Access'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Category filter */}
          <div className="order-2">
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