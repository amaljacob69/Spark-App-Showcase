import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Switch } from './ui/switch'
import { Separator } from './ui/separator'
import { 
  Plus, 
  Trash, 
  PencilSimple, 
  Download, 
  Upload,
  Settings,
  Bell,
  Eye,
  EyeSlash,
  Calendar,
  Clock,
  Tag,
  Percent,
  Gift,
  Users
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { MenuAnalytics } from './MenuAnalytics'
import { MenuItem } from '../App'
import { useKV } from '@github/spark/hooks'

interface SpecialOffer {
  id: string
  title: string
  description: string
  discount: number
  discountType: 'percentage' | 'fixed'
  startDate: string
  endDate: string
  applicableItems: string[]
  isActive: boolean
  code?: string
  minOrder?: number
  maxDiscount?: number
}

interface AdminDashboardProps {
  items: MenuItem[]
  onAddItem: (item: Omit<MenuItem, 'id'>) => void
  onEditItem: (id: string, updates: Partial<MenuItem>) => void
  onDeleteItem: (id: string) => void
}

export function AdminDashboard({ items, onAddItem, onEditItem, onDeleteItem }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [showOfferDialog, setShowOfferDialog] = useState(false)
  const [editingOffer, setEditingOffer] = useState<SpecialOffer | null>(null)
  const [offers, setOffers] = useKV<SpecialOffer[]>('special-offers', [])
  const [settings, setSettings] = useKV('admin-settings', {
    notifications: true,
    autoBackup: true,
    maintenanceMode: false,
    publicAnalytics: false
  })

  const [newOffer, setNewOffer] = useState<Omit<SpecialOffer, 'id'>>({
    title: '',
    description: '',
    discount: 10,
    discountType: 'percentage',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    applicableItems: [],
    isActive: true,
    code: '',
    minOrder: 0,
    maxDiscount: 0
  })

  // Calculate dashboard stats
  const totalItems = items.length
  const availableItems = items.filter(item => item.available).length
  const categoriesCount = new Set(items.map(item => item.category)).size
  const activeOffersCount = offers?.filter(offer => offer.isActive).length || 0

  const handleSaveOffer = useCallback(() => {
    if (!newOffer.title || !newOffer.description) {
      toast.error('Please fill in all required fields')
      return
    }

    const offer: SpecialOffer = {
      ...newOffer,
      id: editingOffer ? editingOffer.id : Date.now().toString()
    }

    if (editingOffer) {
      setOffers(current => 
        (current || []).map(o => o.id === editingOffer.id ? offer : o)
      )
      toast.success('Offer updated successfully')
    } else {
      setOffers(current => [...(current || []), offer])
      toast.success('Offer created successfully')
    }

    setShowOfferDialog(false)
    setEditingOffer(null)
    setNewOffer({
      title: '',
      description: '',
      discount: 10,
      discountType: 'percentage',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      applicableItems: [],
      isActive: true,
      code: '',
      minOrder: 0,
      maxDiscount: 0
    })
  }, [newOffer, editingOffer, setOffers])

  const handleEditOffer = useCallback((offer: SpecialOffer) => {
    setEditingOffer(offer)
    setNewOffer({
      title: offer.title,
      description: offer.description,
      discount: offer.discount,
      discountType: offer.discountType,
      startDate: offer.startDate,
      endDate: offer.endDate,
      applicableItems: offer.applicableItems,
      isActive: offer.isActive,
      code: offer.code || '',
      minOrder: offer.minOrder || 0,
      maxDiscount: offer.maxDiscount || 0
    })
    setShowOfferDialog(true)
  }, [])

  const handleDeleteOffer = useCallback((offerId: string) => {
    if (confirm('Are you sure you want to delete this offer?')) {
      setOffers(current => (current || []).filter(o => o.id !== offerId))
      toast.success('Offer deleted successfully')
    }
  }, [setOffers])

  const handleToggleOffer = useCallback((offerId: string) => {
    setOffers(current => 
      (current || []).map(offer => 
        offer.id === offerId ? { ...offer, isActive: !offer.isActive } : offer
      )
    )
  }, [setOffers])

  const exportData = useCallback(() => {
    const data = {
      items,
      offers: offers || [],
      settings,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `paradise-menu-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Data exported successfully')
  }, [items, offers, settings])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your restaurant menu and offers</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={exportData}
            variant="outline" 
            size="sm" 
            className="gap-2"
          >
            <Download size={16} />
            Export Data
          </Button>
          <Button 
            onClick={() => setActiveTab('settings')}
            variant="outline" 
            size="sm" 
            className="gap-2"
          >
            <Settings size={16} />
            Settings
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Tag size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                    <p className="text-2xl font-bold">{totalItems}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Eye size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Available</p>
                    <p className="text-2xl font-bold text-green-600">{availableItems}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Tag size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Categories</p>
                    <p className="text-2xl font-bold">{categoriesCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Percent size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Offers</p>
                    <p className="text-2xl font-bold text-orange-600">{activeOffersCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Items */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Menu Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {items.slice(-5).reverse().map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={item.available ? 'default' : 'secondary'}>
                        {item.available ? 'Available' : 'Unavailable'}
                      </Badge>
                      <span className="font-semibold text-accent">
                        ${item.prices?.['dinein-ac']?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Special Offers</h2>
            <Button 
              onClick={() => {
                setEditingOffer(null)
                setShowOfferDialog(true)
              }}
              className="gap-2"
            >
              <Plus size={16} />
              New Offer
            </Button>
          </div>

          <div className="grid gap-4">
            {offers && offers.length > 0 ? offers.map(offer => (
              <Card key={offer.id} className={cn(
                "transition-all duration-200",
                !offer.isActive && "opacity-60"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{offer.title}</h3>
                        <Badge variant={offer.isActive ? 'default' : 'secondary'}>
                          {offer.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        {offer.code && (
                          <Badge variant="outline" className="font-mono text-xs">
                            {offer.code}
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">{offer.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Percent size={14} />
                          <span>{offer.discount}{offer.discountType === 'percentage' ? '%' : '$'} off</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{offer.startDate} to {offer.endDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleOffer(offer.id)}
                        className="h-8 w-8 p-0"
                      >
                        {offer.isActive ? <EyeSlash size={16} /> : <Eye size={16} />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditOffer(offer)}
                        className="h-8 w-8 p-0"
                      >
                        <PencilSimple size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteOffer(offer.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Gift size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">No offers yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first special offer to attract customers</p>
                  <Button onClick={() => setShowOfferDialog(true)} className="gap-2">
                    <Plus size={16} />
                    Create Offer
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <MenuAnalytics items={items} isVisible={activeTab === 'analytics'} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications about new orders and updates</p>
                </div>
                <Switch
                  checked={settings?.notifications || false}
                  onCheckedChange={(checked) => 
                    setSettings(current => ({ ...current, notifications: checked }))
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Auto Backup</Label>
                  <p className="text-sm text-muted-foreground">Automatically backup your data daily</p>
                </div>
                <Switch
                  checked={settings?.autoBackup || false}
                  onCheckedChange={(checked) => 
                    setSettings(current => ({ ...current, autoBackup: checked }))
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Temporarily disable the public menu</p>
                </div>
                <Switch
                  checked={settings?.maintenanceMode || false}
                  onCheckedChange={(checked) => 
                    setSettings(current => ({ ...current, maintenanceMode: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Offer Dialog */}
      <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
        <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingOffer ? 'Edit Special Offer' : 'Create Special Offer'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="offer-title">Title *</Label>
                <Input
                  id="offer-title"
                  value={newOffer.title}
                  onChange={(e) => setNewOffer(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Weekend Special"
                />
              </div>
              
              <div>
                <Label htmlFor="offer-code">Promo Code (optional)</Label>
                <Input
                  id="offer-code"
                  value={newOffer.code}
                  onChange={(e) => setNewOffer(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="e.g., WEEKEND20"
                  className="font-mono"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="offer-description">Description *</Label>
              <Textarea
                id="offer-description"
                value={newOffer.description}
                onChange={(e) => setNewOffer(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the offer..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="offer-discount">Discount Amount *</Label>
                <Input
                  id="offer-discount"
                  type="number"
                  value={newOffer.discount}
                  onChange={(e) => setNewOffer(prev => ({ ...prev, discount: Number(e.target.value) }))}
                  min="0"
                />
              </div>
              
              <div>
                <Label htmlFor="offer-type">Discount Type</Label>
                <select
                  id="offer-type"
                  value={newOffer.discountType}
                  onChange={(e) => setNewOffer(prev => ({ ...prev, discountType: e.target.value as 'percentage' | 'fixed' }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="offer-min-order">Min. Order (optional)</Label>
                <Input
                  id="offer-min-order"
                  type="number"
                  value={newOffer.minOrder}
                  onChange={(e) => setNewOffer(prev => ({ ...prev, minOrder: Number(e.target.value) }))}
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="offer-start">Start Date</Label>
                <Input
                  id="offer-start"
                  type="date"
                  value={newOffer.startDate}
                  onChange={(e) => setNewOffer(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="offer-end">End Date</Label>
                <Input
                  id="offer-end"
                  type="date"
                  value={newOffer.endDate}
                  onChange={(e) => setNewOffer(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="offer-active"
                checked={newOffer.isActive}
                onCheckedChange={(checked) => setNewOffer(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="offer-active">Active immediately</Label>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowOfferDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveOffer}>
                {editingOffer ? 'Update Offer' : 'Create Offer'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}