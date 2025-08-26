import { ChefHat, UserCheck, LogOut } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { CategoryFilter } from './CategoryFilter'

interface HeaderProps {
  isAdmin: boolean
  onLogin: () => void
  onLogout: () => void
  categories: string[]
  selectedCategory: string
  onCategorySelect: (category: string) => void
}

export function Header({ 
  isAdmin, 
  onLogin, 
  onLogout, 
  categories, 
  selectedCategory, 
  onCategorySelect 
}: HeaderProps) {
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

        <div className="mt-4">
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