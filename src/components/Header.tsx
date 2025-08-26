import { ChefHat, UserCheck, LogOut, House, AirConditioner, Package } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { CategoryFilter } from './CategoryFilter'
import { MenuTypeSelector } from './MenuTypeSelector'
import { MenuType } from '../App'

interface HeaderProps {
  isAdmin: boolean
  onLogin: () => void
  onLogout: () => void
  categories: string[]
  selectedCategory: string
  onCategorySelect: (category: string) => void
  menuType: MenuType
  onMenuTypeSelect: (type: MenuType) => void
  isDirectLink: boolean
}

export function Header({ 
  isAdmin, 
  onLogin, 
  onLogout, 
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
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChefHat size={32} className="text-primary" />
            <div>
              <h1 className="font-display font-bold text-2xl text-foreground">
                Savory
              </h1>
              <p className="text-sm text-muted-foreground">Fine Dining Experience</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isAdmin ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UserCheck size={16} />
                  Admin Mode
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onLogout}
                  className="gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline"
                onClick={onLogin}
                className="gap-2"
              >
                <UserCheck size={16} />
                Admin Login
              </Button>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Only show menu type selector if not accessing via direct QR link */}
          {!isDirectLink && (
            <MenuTypeSelector 
              selectedType={menuType}
              onTypeSelect={onMenuTypeSelect}
            />
          )}
          {/* Show fixed menu type indicator for QR code direct access */}
          {isDirectLink && (
            <div className="flex items-center gap-2 px-3 py-2 bg-accent/10 text-accent-foreground rounded-md border">
              {getMenuTypeIcon(menuType)}
              <span className="text-sm font-medium">{getMenuTypeName(menuType)}</span>
              <span className="text-xs opacity-75">(QR Access)</span>
            </div>
          )}
          <CategoryFilter 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={onCategorySelect}
          />
        </div>
      </div>
    </header>
  )
}