import { ChefHat, UserCheck, SignOut, House, Snowflake, Package, Palette } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { CategoryFilter } from './CategoryFilter'
import { MenuTypeSelector } from './MenuTypeSelector'
import { SearchBar } from './SearchBar'
import { MenuType } from '@/types'
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
        return 'Dine-in A/C Menu' 
      case 'takeaway':
        return 'Take Away Menu'
    }
  }

  return (
    <header className="bg-gradient-to-r from-card/95 via-card/90 to-card/95 backdrop-blur-xl border-b border-border/30 sticky top-0 z-50 theme-transition safe-area-top shadow-lg">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-5">
        {/* Top row with branding and admin controls */}
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="relative">
              <div className="relative p-2 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg">
                <ChefHat size={32} className="text-primary flex-shrink-0 sm:size-10 drop-shadow-lg" />
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur-md -z-10 animate-pulse" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-display font-bold text-xl sm:text-3xl xl:text-4xl text-foreground truncate text-balance bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                Paradise Family Restaurant & Bake Shop
              </h1>
              <div className="flex items-center gap-3 text-sm sm:text-base text-muted-foreground mt-1">
                <span className="hidden sm:block font-medium">Famous for Kerala, Arabic & Chinese Cuisine</span>
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  <Palette size={14} className="sm:size-4 text-primary" />
                  <span className="font-semibold text-primary text-xs sm:text-sm">{menuThemes[menuType].name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin controls - hidden on direct links */}
          {!isDirectLink && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {isAdmin ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="hidden lg:flex items-center gap-2 text-sm font-medium px-4 py-2 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200 shadow-md">
                    <UserCheck size={18} className="text-green-600" />
                    <span className="text-green-700">Admin Access</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={onAdminLogout}
                    className="gap-2 px-4 sm:px-5 py-2.5 touch-target hover-lift transition-all duration-300 font-semibold rounded-xl shadow-md hover:shadow-lg"
                  >
                    <SignOut size={16} className="sm:size-5" />
                    <span className="hidden sm:inline">Logout</span>
                    <span className="sm:hidden">Out</span>
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline"
                  onClick={onAdminLogin}
                  className="gap-2 text-sm sm:text-base font-semibold px-4 sm:px-5 py-2.5 touch-target hover-lift rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  size="sm"
                >
                  <UserCheck size={16} className="sm:size-5" />
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
                      {menuType === 'dinein-non-ac' ? 'Non-AC Dine-in • QR Access' : 
                       menuType === 'dinein-ac' ? 'A/C Dine-in • QR Access' : 
                       'Take Away • QR Access'}
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