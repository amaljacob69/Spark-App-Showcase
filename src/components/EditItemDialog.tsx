import { useState, useEffect } from 'react'
import { MenuItem } from '../App'
import { DietaryPreference } from './DietaryFilter'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Switch } from './ui/switch'
import { Checkbox } from './ui/checkbox'
import { Leaf, Egg, Bird, Cow, Fish } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface EditItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: MenuItem
  onSave: (updates: Partial<MenuItem>) => void
}

const dietaryOptions = [
  { key: 'vegetarian' as DietaryPreference, label: 'Vegetarian', icon: Leaf, color: 'text-green-600' },
  { key: 'egg' as DietaryPreference, label: 'Contains Egg', icon: Egg, color: 'text-yellow-600' },
  { key: 'chicken' as DietaryPreference, label: 'Chicken', icon: Bird, color: 'text-amber-600' },
  { key: 'meat' as DietaryPreference, label: 'Meat', icon: Cow, color: 'text-red-600' },
  { key: 'fish' as DietaryPreference, label: 'Fish & Seafood', icon: Fish, color: 'text-blue-600' },
]

export function EditItemDialog({ open, onOpenChange, item, onSave }: EditItemDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prices: {
      'dinein-non-ac': '',
      'dinein-ac': '',
      'takeaway': ''
    },
    category: '',
    available: true,
    dietary: [] as DietaryPreference[]
  })

  useEffect(() => {
    if (item && item.prices) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        prices: {
          'dinein-non-ac': (typeof item.prices['dinein-non-ac'] === 'number' && !isNaN(item.prices['dinein-non-ac'])) ? item.prices['dinein-non-ac'].toString() : '',
          'dinein-ac': (typeof item.prices['dinein-ac'] === 'number' && !isNaN(item.prices['dinein-ac'])) ? item.prices['dinein-ac'].toString() : '',
          'takeaway': (typeof item.prices['takeaway'] === 'number' && !isNaN(item.prices['takeaway'])) ? item.prices['takeaway'].toString() : ''
        },
        category: item.category || '',
        available: item.available ?? true,
        dietary: item.dietary || []
      })
    }
  }, [item])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.description || !formData.category || 
        !formData.prices['dinein-non-ac'] || !formData.prices['dinein-ac'] || !formData.prices['takeaway']) {
      toast.error('Please fill in all fields')
      return
    }

    let nonAcPrice: number, acPrice: number, takeawayPrice: number

    try {
      nonAcPrice = parseFloat(formData.prices['dinein-non-ac'])
      acPrice = parseFloat(formData.prices['dinein-ac'])
      takeawayPrice = parseFloat(formData.prices['takeaway'])
    } catch (error) {
      toast.error('Invalid price format')
      return
    }

    if (isNaN(nonAcPrice) || nonAcPrice <= 0 || 
        isNaN(acPrice) || acPrice <= 0 || 
        isNaN(takeawayPrice) || takeawayPrice <= 0) {
      toast.error('Please enter valid prices for all menu types')
      return
    }

    try {
      onSave({
        name: formData.name.trim(),
        description: formData.description.trim(),
        prices: {
          'dinein-non-ac': nonAcPrice,
          'dinein-ac': acPrice,
          'takeaway': takeawayPrice
        },
        category: formData.category.trim(),
        available: formData.available,
        dietary: formData.dietary
      })
    } catch (error) {
      console.error('Error saving item:', error)
      toast.error('Error saving item. Please try again.')
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    if (field.startsWith('price-')) {
      const menuType = field.replace('price-', '') as keyof typeof formData.prices
      setFormData(prev => ({ 
        ...prev, 
        prices: { 
          ...prev.prices, 
          [menuType]: value as string 
        } 
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleDietaryChange = (dietary: DietaryPreference, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      dietary: checked 
        ? [...prev.dietary, dietary]
        : prev.dietary.filter(d => d !== dietary)
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto mx-2 sm:mx-0">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Edit Menu Item</DialogTitle>
          <DialogDescription className="text-sm">
            Update the details for this menu item.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-sm font-medium">Item Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Grilled Salmon"
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category" className="text-sm font-medium">Category *</Label>
              <Input
                id="edit-category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder="mains, appetizers, desserts..."
                required
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description" className="text-sm font-medium">Description *</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Fresh Atlantic salmon grilled to perfection with seasonal vegetables..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Pricing (₹) *</Label>
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="edit-price-dinein-non-ac" className="text-xs text-muted-foreground">
                    Dine-in (Non-A/C)
                  </Label>
                  <Input
                    id="edit-price-dinein-non-ac"
                    type="number"
                    step="1"
                    min="0"
                    value={formData.prices['dinein-non-ac']}
                    onChange={(e) => handleChange('price-dinein-non-ac', e.target.value)}
                    placeholder="220"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="edit-price-dinein-ac" className="text-xs text-muted-foreground">
                    Dine-in (A/C)
                  </Label>
                  <Input
                    id="edit-price-dinein-ac"
                    type="number"
                    step="1"
                    min="0"
                    value={formData.prices['dinein-ac']}
                    onChange={(e) => handleChange('price-dinein-ac', e.target.value)}
                    placeholder="250"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="edit-price-takeaway" className="text-xs text-muted-foreground">
                    Take Away
                  </Label>
                  <Input
                    id="edit-price-takeaway"
                    type="number"
                    step="1"
                    min="0"
                    value={formData.prices['takeaway']}
                    onChange={(e) => handleChange('price-takeaway', e.target.value)}
                    placeholder="200"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Dietary Preferences */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Dietary Information</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {dietaryOptions.map((option) => {
                  const Icon = option.icon
                  const isChecked = formData.dietary.includes(option.key)
                  
                  return (
                    <div key={option.key} className="flex items-center space-x-3">
                      <Checkbox
                        id={`edit-dietary-${option.key}`}
                        checked={isChecked}
                        onCheckedChange={(checked) => handleDietaryChange(option.key, checked as boolean)}
                      />
                      <Label 
                        htmlFor={`edit-dietary-${option.key}`}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <Icon size={14} className={cn(option.color, isChecked ? '' : 'opacity-50')} />
                        {option.label}
                      </Label>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="edit-available" className="text-sm font-medium">
                Available
              </Label>
              <Switch
                id="edit-available"
                checked={formData.available}
                onCheckedChange={(checked) => handleChange('available', checked)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}