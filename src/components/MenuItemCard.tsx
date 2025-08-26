import { useState } from 'react'
import { MenuItem, MenuType } from '../App'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { EditItemDialog } from './EditItemDialog'
import { PencilSimple, Trash, Eye, EyeSlash } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface MenuItemCardProps {
  item: MenuItem
  menuType: MenuType
  getItemPrice: (basePrice: number, menuType: MenuType) => number
  isAdmin: boolean
  onEdit: (id: string, updates: Partial<MenuItem>) => void
  onDelete: (id: string) => void
}

export function MenuItemCard({ item, menuType, getItemPrice, isAdmin, onEdit, onDelete }: MenuItemCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)

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
        "group transition-all duration-200 hover:shadow-md",
        !item.available && "opacity-60"
      )}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-foreground mb-1">
                {item.name}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
            <div className="ml-4 text-right">
              <div className="font-bold text-accent text-lg">
                ${getItemPrice(item.basePrice, menuType).toFixed(2)}
              </div>
              {isAdmin && (
                <div className="text-xs text-muted-foreground">
                  Base: ${item.basePrice.toFixed(2)}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
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
            </div>

            {isAdmin && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleToggleAvailability}
                  className="h-8 w-8 p-0"
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
                >
                  <PencilSimple size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDelete}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive"
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