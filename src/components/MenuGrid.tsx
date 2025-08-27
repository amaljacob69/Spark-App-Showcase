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
}

export function MenuGrid({ items, menuType, getItemPrice, isAdmin, onEditItem, onDeleteItem, searchQuery, selectedCategory }: MenuGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16">
        <div className="max-w-md mx-auto px-4">
          {searchQuery ? (
            <>
              <h3 className="font-display text-lg sm:text-xl text-foreground mb-2">No results found</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                Try searching for different keywords or check another category.
              </p>
            </>
          ) : selectedCategory && selectedCategory !== 'all' ? (
            <>
              <h3 className="font-display text-lg sm:text-xl text-foreground mb-2">No items in {selectedCategory}</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                {isAdmin 
                  ? `Add items to the ${selectedCategory} category using the admin panel below.` 
                  : "Our chef is preparing items for this category. Please check back soon!"
                }
              </p>
            </>
          ) : (
            <>
              <h3 className="font-display text-lg sm:text-xl text-foreground mb-2">No menu items found</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      {items.map((item) => (
        <MenuItemCard
          key={item.id}
          item={item}
          menuType={menuType}
          getItemPrice={getItemPrice}
          isAdmin={isAdmin}
          onEdit={onEditItem}
          onDelete={onDeleteItem}
        />
      ))}
    </div>
  )
}