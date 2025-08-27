import { ChefHat } from '@phosphor-icons/react'
import { MenuItem, MenuType } from '../App'
import { MenuItemCard } from './MenuItemCard'

interface MenuGridProps {
  items: MenuItem[]
  menuType: MenuType
  getItemPrice: (item: MenuItem, menuType: MenuType) => number
  isAdmin: boolean
  onEditItem: (id: string, updates: Partial<MenuItem>) => void
  onDeleteItem: (id: string) => void
  searchQuery?: string
  selectedCategory?: string
  onAddToCart?: (item: MenuItem, menuType: MenuType) => void
}

export function MenuGrid({ items, menuType, getItemPrice, isAdmin, onEditItem, onDeleteItem, searchQuery, selectedCategory, onAddToCart }: MenuGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 lg:py-20">
        <div className="max-w-lg mx-auto px-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <ChefHat size={32} className="text-muted-foreground sm:size-10" />
          </div>
          {searchQuery ? (
            <>
              <h3 className="font-display text-xl sm:text-2xl text-foreground mb-3 text-balance">No results found</h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Try searching for different keywords, check another category, or adjust your dietary filters.
              </p>
            </>
          ) : selectedCategory && selectedCategory !== 'all' ? (
            <>
              <h3 className="font-display text-xl sm:text-2xl text-foreground mb-3 text-balance">No items in {selectedCategory}</h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {isAdmin 
                  ? `Add items to the ${selectedCategory} category using the admin panel below.` 
                  : "Our chef is preparing items for this category. Please check back soon!"
                }
              </p>
            </>
          ) : (
            <>
              <h3 className="font-display text-xl sm:text-2xl text-foreground mb-3 text-balance">No menu items found</h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {isAdmin 
                  ? "Start building your menu by adding your first item below." 
                  : "Our chef is preparing something special. Please check back soon!"
                }
              </p>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
      {items.map((item) => (
        <MenuItemCard
          key={item.id}
          item={item}
          menuType={menuType}
          getItemPrice={getItemPrice}
          isAdmin={isAdmin}
          onEdit={onEditItem}
          onDelete={onDeleteItem}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  )
}