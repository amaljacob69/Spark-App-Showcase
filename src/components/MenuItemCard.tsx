import { useState } from 'react'
import { MenuItem, MenuType } from '../App'
import { DietaryPreference } from './DietaryFilter'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { EditItemDialog } from './EditItemDialog'
import { PencilSimple, Trash, Eye, EyeSlash, Leaf, Egg, Bird, Cow, Fish, Plus } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/currency'

interface MenuItemCardProps {
  item: MenuItem
  menuType: MenuType
  getItemPrice: (item: MenuItem, menuType: MenuType) => number
  isAdmin: boolean
  onEdit: (id: string, updates: Partial<MenuItem>) => void
  onDelete: (id: string) => void
  onAddToCart?: (item: MenuItem, menuType: MenuType) => void
}

const dietaryIcons = {
  vegetarian: { icon: Leaf, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  egg: { icon: Egg, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  chicken: { icon: Bird, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  meat: { icon: Cow, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  fish: { icon: Fish, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' }
}

export function MenuItemCard({ item, menuType, getItemPrice, isAdmin, onEdit, onDelete, onAddToCart }: MenuItemCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)

  // Safety check to ensure item has required properties
  if (!item || !item.id || !item.name) {
    return null
  }

  const handleAddToCart = () => {
    if (onAddToCart && item.available) {
      onAddToCart(item, menuType)
    }
  }

  const handleToggleAvailability = () => {
    onEdit(item.id, { available: !item.available })
    toast.success(`${item.name} ${!item.available ? 'made available' : 'made unavailable'}`)
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      onDelete(item.id)
      toast.success(`${item.name} has been removed from the menu`)
    }
  }

  const handleSave = (updates: Partial<MenuItem>) => {
    onEdit(item.id, updates)
    setShowEditDialog(false)
    toast.success(`${item.name} has been updated`)
  }

  return (
    <>
      <Card className={cn(
        "group overflow-hidden themed-card themed-hover theme-transition hover-glow",
        "border-2 border-transparent hover:border-primary/20",
        !item.available && "opacity-60 grayscale"
      )}>
        <CardContent className="p-4 sm:p-5 lg:p-6">
          {/* Header section with title and price */}
          <div className="flex justify-between items-start mb-3 sm:mb-4 gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base sm:text-lg lg:text-xl text-foreground mb-2 break-words leading-tight text-balance">
                {item.name}
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed break-words line-clamp-3">
                {item.description}
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="font-bold text-accent text-xl sm:text-2xl drop-shadow-sm">
                {formatCurrency(item.prices ? getItemPrice(item, menuType) : 0)}
              </div>
              {isAdmin && (
                <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                  <div>A/C: {formatCurrency(item.prices ? item.prices['dinein-ac'] : 0)}</div>
                  <div>Non-A/C: {formatCurrency(item.prices ? item.prices['dinein-non-ac'] : 0)}</div>
                  <div>Takeaway: {formatCurrency(item.prices ? item.prices['takeaway'] : 0)}</div>
                </div>
              )}
            </div>
          </div>

          {/* Meta information section */}
          <div className="flex flex-col gap-3">
            {/* Category and availability badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                variant="secondary"
                className="text-xs font-medium px-2 py-1"
              >
                {item.category}
              </Badge>
              <Badge 
                variant={item.available ? "default" : "secondary"}
                className={cn(
                  "text-xs font-medium px-2 py-1",
                  item.available 
                    ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200" 
                    : "bg-gray-100 text-gray-600 border-gray-200"
                )}
              >
                {item.available ? 'Available' : 'Unavailable'}
              </Badge>
            </div>
            
            {/* Dietary preferences indicators */}
            {item.dietary && item.dietary.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground font-medium">Contains:</span>
                <div className="flex items-center gap-1.5">
                  {item.dietary.map((dietary) => {
                    const iconInfo = dietaryIcons[dietary]
                    if (!iconInfo) return null
                    
                    const Icon = iconInfo.icon
                    return (
                      <div
                        key={dietary}
                        className={cn(
                          "flex items-center justify-center w-7 h-7 rounded-full border-2 transition-all duration-200 touch-target-sm",
                          iconInfo.bg,
                          iconInfo.border,
                          "hover:scale-110 active:scale-95 cursor-help"
                        )}
                        title={`Contains ${dietary.charAt(0).toUpperCase() + dietary.slice(1)}`}
                      >
                        <Icon size={14} className={iconInfo.color} weight="duotone" />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Add to Cart button for customers */}
            {!isAdmin && onAddToCart && (
              <div className="pt-3 border-t border-border/50">
                <Button
                  onClick={handleAddToCart}
                  disabled={!item.available}
                  className="w-full touch-target hover-lift"
                  size="sm"
                >
                  <Plus size={16} className="mr-2" />
                  Add to Cart
                </Button>
              </div>
            )}

            {/* Admin controls */}
            {isAdmin && (
              <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-border/50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleToggleAvailability}
                  className={cn(
                    "h-8 w-8 p-0 touch-target-sm hover-lift",
                    item.available 
                      ? "hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
                      : "hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                  )}
                  title={item.available ? 'Mark as unavailable' : 'Mark as available'}
                >
                  {item.available ? (
                    <EyeSlash size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowEditDialog(true)}
                  className="h-8 w-8 p-0 touch-target-sm hover-lift hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                  title="Edit item"
                >
                  <PencilSimple size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDelete}
                  className="h-8 w-8 p-0 touch-target-sm hover-lift hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  title="Delete item"
                >
                  <Trash size={16} />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <EditItemDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        item={item}
        onSave={handleSave}
      />
    </>
  )
}