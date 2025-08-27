import { useState } from 'react'
import { MenuItem, MenuType } from '../App'
import { DietaryPreference } from './DietaryFilter'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { EditItemDialog } from './EditItemDialog'
import { PencilSimple, Trash, Eye, EyeSlash, Leaf, Egg, Bird, Cow, Fish } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface MenuItemCardProps {
  item: MenuItem
  menuType: MenuType
  getItemPrice: (item: MenuItem, menuType: MenuType) => number
  isAdmin: boolean
  onEdit: (id: string, updates: Partial<MenuItem>) => void
  onDelete: (id: string) => void
}

const dietaryIcons = {
  vegetarian: { icon: Leaf, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  egg: { icon: Egg, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  chicken: { icon: Bird, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  meat: { icon: Cow, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  fish: { icon: Fish, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' }
}

export function MenuItemCard({ item, menuType, getItemPrice, isAdmin, onEdit, onDelete }: MenuItemCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)

  // Safety check to ensure item has required properties
  if (!item || !item.id || !item.name) {
    return null
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
        "group transition-all duration-300 hover:shadow-md themed-card themed-hover theme-transition",
        !item.available && "opacity-60"
      )}>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base sm:text-lg text-foreground mb-1 break-words">
                {item.name}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed break-words">
                {item.description}
              </p>
            </div>
            <div className="flex-shrink-0 text-right sm:ml-4 self-start">
              <div className="font-bold text-accent text-lg sm:text-xl">
                ${item.prices ? getItemPrice(item, menuType).toFixed(2) : '0.00'}
              </div>
              {isAdmin && (
                <div className="text-xs text-muted-foreground mt-1">
                  AC: ${item.prices ? item.prices['dinein-ac'].toFixed(2) : '0.00'}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                variant="secondary"
                className="text-xs"
              >
                {item.category}
              </Badge>
              <Badge 
                variant={item.available ? "default" : "secondary"}
                className={cn(
                  "text-xs",
                  item.available 
                    ? "bg-green-100 text-green-800 border-green-200" 
                    : "bg-gray-100 text-gray-600 border-gray-200"
                )}
              >
                {item.available ? 'Available' : 'Unavailable'}
              </Badge>
              
              {/* Dietary preferences indicators */}
              {item.dietary && item.dietary.length > 0 && (
                <div className="flex items-center gap-1">
                  {item.dietary.map((dietary) => {
                    const iconInfo = dietaryIcons[dietary]
                    if (!iconInfo) return null
                    
                    const Icon = iconInfo.icon
                    return (
                      <div
                        key={dietary}
                        className={cn(
                          "flex items-center justify-center w-6 h-6 rounded-full border transition-all duration-200",
                          iconInfo.bg,
                          iconInfo.border,
                          "hover:scale-110"
                        )}
                        title={dietary.charAt(0).toUpperCase() + dietary.slice(1)}
                      >
                        <Icon size={12} className={iconInfo.color} />
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {isAdmin && (
              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleToggleAvailability}
                  className="h-8 w-8 p-0"
                  title={item.available ? 'Mark as unavailable' : 'Mark as available'}
                >
                  {item.available ? (
                    <EyeSlash size={14} />
                  ) : (
                    <Eye size={14} />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowEditDialog(true)}
                  className="h-8 w-8 p-0"
                  title="Edit item"
                >
                  <PencilSimple size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDelete}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                  title="Delete item"
                >
                  <Trash size={14} />
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