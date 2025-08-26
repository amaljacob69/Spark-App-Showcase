import { useState, useEffect } from 'react'
import { MenuItem } from '../App'
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
import { toast } from 'sonner'

interface EditItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: MenuItem
  onSave: (updates: Partial<MenuItem>) => void
}

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
    available: true
  })

  useEffect(() => {
    if (item && item.prices) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        prices: {
          'dinein-non-ac': item.prices['dinein-non-ac']?.toString() || '',
          'dinein-ac': item.prices['dinein-ac']?.toString() || '',
          'takeaway': item.prices['takeaway']?.toString() || ''
        },
        category: item.category || '',
        available: item.available ?? true
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

    const nonAcPrice = parseFloat(formData.prices['dinein-non-ac'])
    const acPrice = parseFloat(formData.prices['dinein-ac'])
    const takeawayPrice = parseFloat(formData.prices['takeaway'])

    if (isNaN(nonAcPrice) || nonAcPrice <= 0 || 
        isNaN(acPrice) || acPrice <= 0 || 
        isNaN(takeawayPrice) || takeawayPrice <= 0) {
      toast.error('Please enter valid prices for all menu types')
      return
    }

    onSave({
      name: formData.name.trim(),
      description: formData.description.trim(),
      prices: {
        'dinein-non-ac': nonAcPrice,
        'dinein-ac': acPrice,
        'takeaway': takeawayPrice
      },
      category: formData.category.trim(),
      available: formData.available
    })
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Menu Item</DialogTitle>
          <DialogDescription>
            Update the details for this menu item.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Item Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Grilled Salmon"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category *</Label>
              <Input
                id="edit-category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder="mains, appetizers, desserts..."
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description *</Label>
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
              <Label className="text-sm font-medium">Pricing ($) *</Label>
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="edit-price-dinein-non-ac" className="text-xs text-muted-foreground">
                    Dine-in (Non-AC)
                  </Label>
                  <Input
                    id="edit-price-dinein-non-ac"
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
                  <Label htmlFor="edit-price-dinein-ac" className="text-xs text-muted-foreground">
                    Dine-in (AC)
                  </Label>
                  <Input
                    id="edit-price-dinein-ac"
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
                  <Label htmlFor="edit-price-takeaway" className="text-xs text-muted-foreground">
                    Take Away
                  </Label>
                  <Input
                    id="edit-price-takeaway"
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