import { useState } from 'react'
import { MenuItem, MenuType, DietaryPreference } from '@/types'
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
        "border-2 transition-all duration-300 rounded-xl",
        "shadow-sm hover:shadow-xl",
        "bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm",
        "hover:border-primary/30 border-border/60",
        !item.available && "opacity-60 grayscale"
      )}>
        <CardContent className="p-5 sm:p-6 lg:p-7">
          {/* Header section with title and price */}
          <div className="flex justify-between items-start mb-4 gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-lg sm:text-xl lg:text-2xl text-foreground mb-3 break-words leading-tight text-balance">
                {item.name}
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed break-words line-clamp-2 font-medium opacity-90">
                {item.description}
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="relative">
                <div className="font-display font-bold text-primary text-2xl sm:text-3xl lg:text-4xl drop-shadow-lg">
                  {formatCurrency(item.prices ? getItemPrice(item, menuType) : 0)}
                </div>
                <div className="absolute -inset-1 bg-primary/10 rounded-lg blur-sm -z-10" />
              </div>
              {isAdmin && (
                <div className="text-xs text-muted-foreground mt-2 space-y-1 bg-muted/50 rounded-lg p-2 backdrop-blur-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">A/C:</span>
                    <span className="font-mono">{formatCurrency(item.prices ? item.prices['dinein-ac'] : 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Non-A/C:</span>
                    <span className="font-mono">{formatCurrency(item.prices ? item.prices['dinein-non-ac'] : 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Takeaway:</span>
                    <span className="font-mono">{formatCurrency(item.prices ? item.prices['takeaway'] : 0)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Meta information section */}
          <div className="flex flex-col gap-4">
            {/* Category and availability badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                variant="secondary"
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-secondary to-secondary/80 border border-border/50"
              >
                {item.category}
              </Badge>
              <Badge 
                variant={item.available ? "default" : "secondary"}
                className={cn(
                  "text-xs font-semibold px-3 py-1.5 rounded-full",
                  item.available 
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/25 shadow-lg border-green-400" 
                    : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                )}
              >
                {item.available ? '✨ Available' : '⏸️ Unavailable'}
              </Badge>
            </div>
            
            {/* Dietary preferences indicators */}
            {item.dietary && item.dietary.length > 0 && (
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm text-muted-foreground font-semibold">Contains:</span>
                <div className="flex items-center gap-2">
                  {item.dietary.map((dietary) => {
                    const iconInfo = dietaryIcons[dietary]
                    if (!iconInfo) return null
                    
                    const Icon = iconInfo.icon
                    return (
                      <div
                        key={dietary}
                        className={cn(
                          "flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-300 touch-target-sm",
                          "shadow-lg hover:shadow-xl",
                          iconInfo.bg,
                          iconInfo.border,
                          "hover:scale-110 active:scale-95 cursor-help transform-gpu",
                          "bg-gradient-to-br"
                        )}
                        title={`Contains ${dietary.charAt(0).toUpperCase() + dietary.slice(1)}`}
                      >
                        <Icon size={16} className={cn(iconInfo.color, "drop-shadow-sm")} weight="duotone" />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Add to Cart button for customers */}
            {!isAdmin && onAddToCart && (
              <div className="pt-4 border-t border-border/50">
                <Button
                  onClick={handleAddToCart}
                  disabled={!item.available}
                  className={cn(
                    "w-full touch-target hover-lift rounded-xl font-semibold text-base py-3",
                    "bg-gradient-to-r from-primary to-primary/90 hover:from-primary hover:to-primary",
                    "shadow-lg hover:shadow-xl transition-all duration-300 transform-gpu",
                    "disabled:from-gray-300 disabled:to-gray-400"
                  )}
                  size="lg"
                >
                  <Plus size={20} className="mr-2" />
                  Add to Cart
                </Button>
              </div>
            )}

            {/* Admin controls */}
            {isAdmin && (
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleToggleAvailability}
                  className={cn(
                    "h-10 w-10 p-0 touch-target-sm hover-lift rounded-xl",
                    "shadow-md hover:shadow-lg transition-all duration-300",
                    item.available 
                      ? "hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 hover:shadow-orange-200"
                      : "hover:bg-green-50 hover:text-green-600 hover:border-green-300 hover:shadow-green-200"
                  )}
                  title={item.available ? 'Mark as unavailable' : 'Mark as available'}
                >
                  {item.available ? (
                    <EyeSlash size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowEditDialog(true)}
                  className="h-10 w-10 p-0 touch-target-sm hover-lift rounded-xl shadow-md hover:shadow-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 hover:shadow-blue-200 transition-all duration-300"
                  title="Edit item"
                >
                  <PencilSimple size={18} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDelete}
                  className="h-10 w-10 p-0 touch-target-sm hover-lift rounded-xl shadow-md hover:shadow-lg hover:bg-red-50 hover:text-red-600 hover:border-red-300 hover:shadow-red-200 transition-all duration-300"
                  title="Delete item"
                >
                  <Trash size={18} />
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