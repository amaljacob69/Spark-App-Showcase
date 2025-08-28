import { useState } from 'react'
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

interface AddItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddItem: (item: Omit<MenuItem, 'id'>) => void
}

const dietaryOptions = [
  { key: 'vegetarian' as DietaryPreference, label: 'Vegetarian', icon: Leaf, color: 'text-green-600' },
  { key: 'egg' as DietaryPreference, label: 'Contains Egg', icon: Egg, color: 'text-yellow-600' },
  { key: 'chicken' as DietaryPreference, label: 'Chicken', icon: Bird, color: 'text-amber-600' },
  { key: 'meat' as DietaryPreference, label: 'Meat', icon: Cow, color: 'text-red-600' },
  { key: 'fish' as DietaryPreference, label: 'Fish & Seafood', icon: Fish, color: 'text-blue-600' },
]

export function AddItemDialog({ open, onOpenChange, onAddItem }: AddItemDialogProps) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.description || !formData.category || 
        !formData.prices['dinein-non-ac'] || !formData.prices['dinein-ac'] || !formData.prices['takeaway']) {
      toast.error('Please fill in all fields')
      return
    }

    const nonAcPrice = parseFloat(formData.prices['dinein-non-ac'])
    const acPrice = parseFloat(formData.prices['dinein-ac'])
    const takeawayPrice = parseFloat(formData.prices['takeaway'])

    if (isNaN(nonAcPrice) || nonAcPrice <= 0 || 
        isNaN(acPrice) || acPrice <= 0 || 
        isNaN(takeawayPrice) || takeawayPrice <= 0) {
      toast.error('Please enter valid prices for all menu types')
      return
    }

    onAddItem({
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

    setFormData({
      name: '',
      description: '',
      prices: {
        'dinein-non-ac': '',
        'dinein-ac': '',
        'takeaway': ''
      },
      category: '',
      available: true,
      dietary: []
    })

    toast.success(`${formData.name} has been added to the menu`)
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
          <DialogTitle className="text-lg sm:text-xl">Add New Menu Item</DialogTitle>
          <DialogDescription className="text-sm">
            Fill in the details for your new menu item.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Item Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Grilled Salmon"
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder="mains, appetizers, desserts..."
                required
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Fresh Atlantic salmon grilled to perfection with seasonal vegetables..."
              rows={3}
              required
              className="w-full resize-none"
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Pricing ($) *</Label>
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="price-dinein-non-ac" className="text-xs text-muted-foreground">
                    Dine-in (Non-AC)
                  </Label>
                  <Input
                    id="price-dinein-non-ac"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.prices['dinein-non-ac']}
                    onChange={(e) => handleChange('price-dinein-non-ac', e.target.value)}
                    placeholder="22.99"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="price-dinein-ac" className="text-xs text-muted-foreground">
                    Dine-in (A/C)
                  </Label>
                  <Input
                    id="price-dinein-ac"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.prices['dinein-ac']}
                    onChange={(e) => handleChange('price-dinein-ac', e.target.value)}
                    placeholder="24.99"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="price-takeaway" className="text-xs text-muted-foreground">
                    Take Away
                  </Label>
                  <Input
                    id="price-takeaway"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.prices['takeaway']}
                    onChange={(e) => handleChange('price-takeaway', e.target.value)}
                    placeholder="19.99"
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
                        id={`dietary-${option.key}`}
                        checked={isChecked}
                        onCheckedChange={(checked) => handleDietaryChange(option.key, checked as boolean)}
                      />
                      <Label 
                        htmlFor={`dietary-${option.key}`}
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
              <Label htmlFor="available" className="text-sm font-medium">
                Available
              </Label>
              <Switch
                id="available"
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
              Add Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}