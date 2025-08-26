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
    basePrice: '',
    category: '',
    available: true
  })

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description,
        basePrice: item.basePrice.toString(),
        category: item.category,
        available: item.available
      })
    }
  }, [item])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.description || !formData.basePrice || !formData.category) {
      toast.error('Please fill in all fields')
      return
    }

    const basePrice = parseFloat(formData.basePrice)
    if (isNaN(basePrice) || basePrice <= 0) {
      toast.error('Please enter a valid price')
      return
    }

    onSave({
      name: formData.name.trim(),
      description: formData.description.trim(),
      basePrice: basePrice,
      category: formData.category.trim(),
      available: formData.available
    })
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-basePrice">Base Price ($) *</Label>
              <Input
                id="edit-basePrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.basePrice}
                onChange={(e) => handleChange('basePrice', e.target.value)}
                placeholder="24.99"
                required
              />
              <p className="text-xs text-muted-foreground">
                This price will be adjusted based on menu type selection
              </p>
            </div>
            <div className="flex items-center justify-between pt-7">
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