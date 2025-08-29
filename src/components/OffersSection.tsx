import { useState } from 'react'
import { useKV } from '@/hooks/useKV'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Switch } from './ui/switch'
import { Percent, Clock, Star, Gift, Plus, Edit2, Trash2, Calendar, Tag } from '@phosphor-icons/react'
import { MenuType } from '@/types'
import { toast } from 'sonner'

export interface SpecialOffer {
  id: string
  title: string
  description: string
  type: 'discount' | 'special' | 'combo' | 'daily-special'
  discountPercent?: number
  originalPrice?: number
  specialPrice?: number
  validUntil?: string
  availableDays?: string[]
  isActive: boolean
  menuTypes: MenuType[]
  category?: string
  badge?: string
  featured: boolean
}

interface OffersSectionProps {
  isAdmin: boolean
  menuType: MenuType
}

const sampleOffers: SpecialOffer[] = [
  {
    id: '1',
    title: '20% Off Weekend Special',
    description: 'Get 20% off on all chicken dishes during weekends. Perfect for family dining!',
    type: 'discount',
    discountPercent: 20,
    validUntil: '2024-12-31',
    availableDays: ['Saturday', 'Sunday'],
    isActive: true,
    menuTypes: ['dinein-ac', 'dinein-non-ac'],
    category: 'Chicken',
    badge: 'Weekend Only',
    featured: true
  },
  {
    id: '2',
    title: 'Fish & Chips Combo',
    description: 'Our signature fish & chips with a complimentary soft drink and dessert',
    type: 'combo',
    originalPrice: 25,
    specialPrice: 22,
    validUntil: '2024-12-25',
    isActive: true,
    menuTypes: ['dinein-ac', 'dinein-non-ac', 'takeaway'],
    category: 'Fish',
    badge: 'Best Value',
    featured: false
  },
  {
    id: '3',
    title: "Chef's Daily Special",
    description: 'Today: Grilled Salmon with seasonal vegetables and lemon butter sauce',
    type: 'daily-special',
    specialPrice: 28,
    availableDays: [new Date().toLocaleDateString('en-US', { weekday: 'long' })],
    isActive: true,
    menuTypes: ['dinein-ac', 'dinein-non-ac'],
    category: 'Fish',
    badge: 'Today Only',
    featured: true
  },
  {
    id: '4',
    title: 'Takeaway Tuesday',
    description: '15% discount on all takeaway orders every Tuesday. Order online or call ahead!',
    type: 'discount',
    discountPercent: 15,
    availableDays: ['Tuesday'],
    isActive: true,
    menuTypes: ['takeaway'],
    badge: 'Tuesdays',
    featured: false
  },
  {
    id: '5',
    title: 'Family Feast Deal',
    description: 'Perfect for 4 people: 2 mains, 2 sides, 4 drinks, and 1 shared dessert',
    type: 'combo',
    originalPrice: 85,
    specialPrice: 70,
    validUntil: '2024-12-31',
    isActive: true,
    menuTypes: ['dinein-ac', 'dinein-non-ac'],
    badge: 'Family Deal',
    featured: true
  }
]

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function OffersSection({ isAdmin, menuType }: OffersSectionProps) {
  const [offers, setOffers] = useKV<SpecialOffer[]>('special-offers', sampleOffers)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingOffer, setEditingOffer] = useState<SpecialOffer | null>(null)
  const [newOffer, setNewOffer] = useState<Partial<SpecialOffer>>({
    type: 'discount',
    isActive: true,
    menuTypes: [menuType],
    featured: false,
    availableDays: []
  })

  const safeOffers = offers || sampleOffers

  // Filter offers based on current menu type, active status, and availability
  const activeOffers = safeOffers.filter(offer => 
    offer.isActive && 
    offer.menuTypes.includes(menuType) &&
    (!offer.availableDays?.length || 
     offer.availableDays.includes(new Date().toLocaleDateString('en-US', { weekday: 'long' })))
  )

  const featuredOffers = activeOffers.filter(offer => offer.featured)
  const regularOffers = activeOffers.filter(offer => !offer.featured)

  const handleAddOffer = () => {
    if (!newOffer.title || !newOffer.description) {
      toast.error('Please fill in all required fields')
      return
    }

    const offer: SpecialOffer = {
      id: Date.now().toString(),
      title: newOffer.title!,
      description: newOffer.description!,
      type: newOffer.type || 'discount',
      discountPercent: newOffer.discountPercent,
      originalPrice: newOffer.originalPrice,
      specialPrice: newOffer.specialPrice,
      validUntil: newOffer.validUntil,
      availableDays: newOffer.availableDays || [],
      isActive: newOffer.isActive ?? true,
      menuTypes: newOffer.menuTypes || [menuType],
      category: newOffer.category,
      badge: newOffer.badge,
      featured: newOffer.featured ?? false
    }

    setOffers(current => [...(current || []), offer])
    setNewOffer({
      type: 'discount',
      isActive: true,
      menuTypes: [menuType],
      featured: false,
      availableDays: []
    })
    setShowAddDialog(false)
    toast.success('Special offer added successfully!')
  }

  const handleEditOffer = (offer: SpecialOffer) => {
    setEditingOffer(offer)
    setNewOffer({...offer})
  }

  const handleUpdateOffer = () => {
    if (!editingOffer || !newOffer.title || !newOffer.description) {
      toast.error('Please fill in all required fields')
      return
    }

    const updatedOffer: SpecialOffer = {
      ...editingOffer,
      ...newOffer,
      id: editingOffer.id
    }

    setOffers(current => 
      (current || []).map(offer => 
        offer.id === editingOffer.id ? updatedOffer : offer
      )
    )
    
    setEditingOffer(null)
    setNewOffer({
      type: 'discount',
      isActive: true,
      menuTypes: [menuType],
      featured: false,
      availableDays: []
    })
    toast.success('Special offer updated successfully!')
  }

  const handleDeleteOffer = (id: string) => {
    setOffers(current => (current || []).filter(offer => offer.id !== id))
    toast.success('Special offer deleted successfully!')
  }

  const toggleOfferStatus = (id: string, isActive: boolean) => {
    setOffers(current =>
      (current || []).map(offer =>
        offer.id === id ? { ...offer, isActive } : offer
      )
    )
    toast.success(`Offer ${isActive ? 'activated' : 'deactivated'} successfully!`)
  }

  const getOfferIcon = (type: SpecialOffer['type']) => {
    switch (type) {
      case 'discount': return <Percent className="w-4 h-4" weight="bold" />
      case 'daily-special': return <Star className="w-4 h-4" weight="bold" />
      case 'combo': return <Gift className="w-4 h-4" weight="bold" />
      default: return <Tag className="w-4 h-4" weight="bold" />
    }
  }

  const getOfferPrice = (offer: SpecialOffer) => {
    if (offer.type === 'discount' && offer.discountPercent) {
      return `${offer.discountPercent}% OFF`
    }
    if (offer.specialPrice) {
      return offer.originalPrice 
        ? `$${offer.specialPrice} (was $${offer.originalPrice})`
        : `$${offer.specialPrice}`
    }
    return null
  }

  if (!activeOffers.length && !isAdmin) {
    return null
  }

  return (
    <section className="mb-6 sm:mb-8 lg:mb-10">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-primary" weight="bold" />
          <h2 className="text-lg sm:text-xl lg:text-2xl font-display font-bold text-foreground">
            Special Offers & Daily Deals
          </h2>
        </div>
        {isAdmin && (
          <Dialog open={showAddDialog || !!editingOffer} onOpenChange={(open) => {
            if (!open) {
              setShowAddDialog(false)
              setEditingOffer(null)
              setNewOffer({
                type: 'discount',
                isActive: true,
                menuTypes: [menuType],
                featured: false,
                availableDays: []
              })
            }
          }}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => setShowAddDialog(true)} className="touch-target-sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Offer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingOffer ? 'Edit Special Offer' : 'Add New Special Offer'}
                </DialogTitle>
                <DialogDescription>
                  Create attractive offers to boost customer engagement and sales.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newOffer.title || ''}
                    onChange={(e) => setNewOffer(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Weekend Special 20% Off"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={newOffer.description || ''}
                    onChange={(e) => setNewOffer(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your special offer in detail..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Offer Type</Label>
                    <Select value={newOffer.type} onValueChange={(value) => setNewOffer(prev => ({ ...prev, type: value as SpecialOffer['type'] }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="discount">Discount</SelectItem>
                        <SelectItem value="special">Special Price</SelectItem>
                        <SelectItem value="combo">Combo Deal</SelectItem>
                        <SelectItem value="daily-special">Daily Special</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="badge">Badge Text</Label>
                    <Input
                      id="badge"
                      value={newOffer.badge || ''}
                      onChange={(e) => setNewOffer(prev => ({ ...prev, badge: e.target.value }))}
                      placeholder="e.g., Limited Time"
                    />
                  </div>
                </div>
                
                {newOffer.type === 'discount' && (
                  <div className="grid gap-2">
                    <Label htmlFor="discount">Discount Percentage</Label>
                    <Input
                      id="discount"
                      type="number"
                      min="1"
                      max="100"
                      value={newOffer.discountPercent || ''}
                      onChange={(e) => setNewOffer(prev => ({ ...prev, discountPercent: Number(e.target.value) }))}
                      placeholder="20"
                    />
                  </div>
                )}
                
                {(newOffer.type === 'special' || newOffer.type === 'combo' || newOffer.type === 'daily-special') && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="originalPrice">Original Price ($)</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={newOffer.originalPrice || ''}
                        onChange={(e) => setNewOffer(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                        placeholder="25.00"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="specialPrice">Special Price ($) *</Label>
                      <Input
                        id="specialPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={newOffer.specialPrice || ''}
                        onChange={(e) => setNewOffer(prev => ({ ...prev, specialPrice: Number(e.target.value) }))}
                        placeholder="20.00"
                      />
                    </div>
                  </div>
                )}
                
                <div className="grid gap-2">
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={newOffer.validUntil || ''}
                    onChange={(e) => setNewOffer(prev => ({ ...prev, validUntil: e.target.value }))}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Available Days</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {daysOfWeek.map(day => (
                      <label key={day} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={newOffer.availableDays?.includes(day) || false}
                          onChange={(e) => {
                            const days = newOffer.availableDays || []
                            if (e.target.checked) {
                              setNewOffer(prev => ({ ...prev, availableDays: [...days, day] }))
                            } else {
                              setNewOffer(prev => ({ ...prev, availableDays: days.filter(d => d !== day) }))
                            }
                          }}
                          className="rounded"
                        />
                        <span>{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newOffer.featured || false}
                      onCheckedChange={(checked) => setNewOffer(prev => ({ ...prev, featured: checked }))}
                    />
                    <Label>Featured Offer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newOffer.isActive ?? true}
                      onCheckedChange={(checked) => setNewOffer(prev => ({ ...prev, isActive: checked }))}
                    />
                    <Label>Active</Label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => {
                  setShowAddDialog(false)
                  setEditingOffer(null)
                }}>
                  Cancel
                </Button>
                <Button onClick={editingOffer ? handleUpdateOffer : handleAddOffer}>
                  {editingOffer ? 'Update' : 'Add'} Offer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Featured Offers */}
      {featuredOffers.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-accent" weight="fill" />
            Featured Offers
          </h3>
          <div className="grid gap-3 sm:gap-4">
            {featuredOffers.map((offer) => (
              <Card key={offer.id} className="themed-card themed-hover border-2">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {getOfferIcon(offer.type)}
                        <h4 className="font-semibold text-foreground text-sm sm:text-base break-anywhere">
                          {offer.title}
                        </h4>
                        {offer.badge && (
                          <Badge variant="secondary" className="text-xs shrink-0">
                            {offer.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 break-anywhere">
                        {offer.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                        {getOfferPrice(offer) && (
                          <Badge variant="default" className="text-xs font-bold">
                            {getOfferPrice(offer)}
                          </Badge>
                        )}
                        {offer.validUntil && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>Until {new Date(offer.validUntil).toLocaleDateString()}</span>
                          </div>
                        )}
                        {offer.availableDays?.length && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>{offer.availableDays.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditOffer(offer)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleOfferStatus(offer.id, !offer.isActive)}
                          className="h-8 w-8 p-0"
                        >
                          <Switch checked={offer.isActive} onChange={() => {}} className="pointer-events-none scale-75" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteOffer(offer.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Regular Offers */}
      {regularOffers.length > 0 && (
        <div>
          {featuredOffers.length > 0 && (
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3">
              More Offers
            </h3>
          )}
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {regularOffers.map((offer) => (
              <Card key={offer.id} className="themed-card themed-hover">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getOfferIcon(offer.type)}
                      <CardTitle className="text-sm sm:text-base break-anywhere">
                        {offer.title}
                      </CardTitle>
                    </div>
                    {offer.badge && (
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {offer.badge}
                      </Badge>
                    )}
                  </div>
                  {getOfferPrice(offer) && (
                    <Badge variant="default" className="text-xs font-bold w-fit">
                      {getOfferPrice(offer)}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-xs sm:text-sm mb-3 break-anywhere">
                    {offer.description}
                  </CardDescription>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {offer.validUntil && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>Until {new Date(offer.validUntil).toLocaleDateString()}</span>
                      </div>
                    )}
                    {offer.availableDays?.length && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{offer.availableDays.slice(0, 2).join(', ')}{offer.availableDays.length > 2 ? '...' : ''}</span>
                      </div>
                    )}
                  </div>
                  {isAdmin && (
                    <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-border">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditOffer(offer)}
                        className="h-7 px-2 text-xs"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleOfferStatus(offer.id, !offer.isActive)}
                        className="h-7 px-2 text-xs"
                      >
                        <Switch checked={offer.isActive} onChange={() => {}} className="pointer-events-none scale-75" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteOffer(offer.id)}
                        className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Admin-only view of all offers */}
      {isAdmin && safeOffers.length > activeOffers.length && (
        <div className="mt-6 sm:mt-8">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 text-muted-foreground">
            Inactive/Unavailable Offers ({safeOffers.length - activeOffers.length})
          </h3>
          <div className="grid gap-2 sm:gap-3">
            {safeOffers
              .filter(offer => !activeOffers.includes(offer))
              .map((offer) => (
                <Card key={offer.id} className="opacity-60 border-dashed">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {getOfferIcon(offer.type)}
                        <span className="font-medium text-sm">{offer.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {offer.isActive ? 'Not Today' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditOffer(offer)}
                          className="h-7 px-2 text-xs"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleOfferStatus(offer.id, !offer.isActive)}
                          className="h-7 px-2 text-xs"
                        >
                          <Switch checked={offer.isActive} onChange={() => {}} className="pointer-events-none scale-75" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteOffer(offer.id)}
                          className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty state for non-admin users */}
      {!activeOffers.length && !isAdmin && (
        <Card className="themed-card">
          <CardContent className="text-center py-8 sm:py-12">
            <Gift className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
              No special offers available
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Check back later for exciting deals and daily specials!
            </p>
          </CardContent>
        </Card>
      )}
    </section>
  )
}