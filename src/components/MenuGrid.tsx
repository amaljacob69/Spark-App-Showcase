import { MenuItem, MenuType } from '../App'
import { MenuItemCard } from './MenuItemCard'

interface MenuGridProps {
  items: MenuItem[]
  menuType: MenuType
  getItemPrice: (basePrice: number, menuType: MenuType) => number
  isAdmin: boolean
  onEditItem: (id: string, updates: Partial<MenuItem>) => void
  onDeleteItem: (id: string) => void
}

export function MenuGrid({ items, menuType, getItemPrice, isAdmin, onEditItem, onDeleteItem }: MenuGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <h3 className="font-display text-xl text-foreground mb-2">No menu items found</h3>
          <p className="text-muted-foreground">
            {isAdmin 
              ? "Start building your menu by adding your first item below." 
              : "Our chef is preparing something special. Please check back soon!"
            }
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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