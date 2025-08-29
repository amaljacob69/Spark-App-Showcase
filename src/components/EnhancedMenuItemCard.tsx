import { useState, useRef } from 'react'
import { MenuItem, MenuType } from '@/types'
import { DietaryPreference } from './DietaryFilter'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { EditItemDialog } from './EditItemDialog'
import { 
  PencilSimple, 
  Trash, 
  Eye, 
  EyeSlash, 
  Leaf, 
  Egg, 
  Bird, 
  Cow, 
  Fish, 
  Plus,
  Heart,
  HeartStraight,
  Star,
  Clock,
  TrendUp,
  Camera,
  Image as ImageIcon,
  Share
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useKV } from '@/hooks/useKV'

interface EnhancedMenuItemCardProps {
  item: MenuItem
  menuType: MenuType
  getItemPrice: (item: MenuItem, menuType: MenuType) => number
  isAdmin: boolean
  onEdit: (id: string, updates: Partial<MenuItem>) => void
  onDelete: (id: string) => void
  onAddToCart?: (item: MenuItem, menuType: MenuType) => void
  isPopular?: boolean
  isTrending?: boolean
  isNew?: boolean
}

const dietaryIcons = {
  vegetarian: { icon: Leaf, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Vegetarian' },
  egg: { icon: Egg, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', label: 'Contains Egg' },
  chicken: { icon: Bird, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Chicken' },
  meat: { icon: Cow, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Meat' },
  fish: { icon: Fish, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Fish/Seafood' }
}

export function EnhancedMenuItemCard({ 
  item, 
  menuType, 
  getItemPrice, 
  isAdmin, 
  onEdit, 
  onDelete, 
  onAddToCart,
  isPopular = false,
  isTrending = false,
  isNew = false
}: EnhancedMenuItemCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [isLiked, setIsLiked] = useKV<boolean>(`liked-${item.id}`, false)
  const [favorites, setFavorites] = useKV<string[]>('favorite-items', [])
  const [imageError, setImageError] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Safety check
  if (!item || !item.id || !item.name) {
    return null
  }

  const isFavorite = favorites?.includes(item.id) || false
  const price = getItemPrice(item, menuType)

  const handleAddToCart = () => {
    if (onAddToCart && item.available) {
      onAddToCart(item, menuType)
      setIsLiked(true)
      setTimeout(() => setIsLiked(false), 1500) // Reset heart animation
    }
  }

  const handleToggleFavorite = () => {
    if (isFavorite) {
      setFavorites(current => (current || []).filter(id => id !== item.id))
      toast.success(`${item.name} removed from favorites`, { duration: 2000 })
    } else {
      setFavorites(current => [...(current || []), item.id])
      toast.success(`${item.name} added to favorites`, { duration: 2000 })
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.name,
          text: `Check out ${item.name} - ${item.description}`,
          url: window.location.href
        })
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${item.name} - ${item.description}\n${window.location.href}`)
        toast.success('Item details copied to clipboard!')
      } catch (err) {
        toast.error('Failed to share item')
      }
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real app, you'd upload to a service like Cloudinary or Firebase Storage
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        onEdit(item.id, { image: imageUrl })
        toast.success('Image uploaded successfully!')
      }
      reader.readAsDataURL(file)
    }
  }

  // Generate a mock rating for demonstration
  const mockRating = 3.5 + (parseInt(item.id) % 15) / 10
  const mockReviews = 12 + (parseInt(item.id) % 50)

  return (
    <>
      <Card className={cn(
        "group overflow-hidden themed-card themed-hover theme-transition hover-glow relative",
        "border-2 border-transparent hover:border-primary/20 transform hover:scale-[1.02]",
        !item.available && "opacity-60 grayscale",
        "transition-all duration-300 ease-out"
      )}>
        {/* Status Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {isNew && (
            <Badge className="bg-green-500 text-white text-xs px-2 py-1 shadow-lg animate-pulse">
              NEW
            </Badge>
          )}
          {isPopular && (
            <Badge className="bg-orange-500 text-white text-xs px-2 py-1 shadow-lg flex items-center gap-1">
              <Star size={10} weight="fill" />
              POPULAR
            </Badge>
          )}
          {isTrending && (
            <Badge className="bg-purple-500 text-white text-xs px-2 py-1 shadow-lg flex items-center gap-1">
              <TrendUp size={10} weight="bold" />
              TRENDING
            </Badge>
          )}
        </div>

        {/* Favorite Button - Non-admin only */}
        {!isAdmin && (
          <div className="absolute top-3 right-3 z-10">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleToggleFavorite}
              className={cn(
                "h-8 w-8 p-0 rounded-full backdrop-blur-sm border transition-all duration-200",
                "hover:scale-110 active:scale-95 touch-target-sm",
                isFavorite 
                  ? "bg-red-50/90 border-red-200 hover:bg-red-100 text-red-600" 
                  : "bg-white/90 border-gray-200 hover:bg-gray-50 text-gray-600"
              )}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? (
                <Heart size={14} weight="fill" className="text-red-500" />
              ) : (
                <HeartStraight size={14} />
              )}
            </Button>
          </div>
        )}

        {/* Image Section */}
        {(item.image || isAdmin) && (
          <div className="relative h-48 sm:h-56 overflow-hidden bg-muted/30">
            {item.image && !imageError ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                onClick={() => setShowImageDialog(true)}
                onError={() => setImageError(true)}
                loading="lazy"
              />
            ) : (
              <div 
                className={cn(
                  "w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-muted to-muted/50",
                  isAdmin && "cursor-pointer hover:bg-muted/70 transition-colors"
                )}
                onClick={isAdmin ? () => fileInputRef.current?.click() : undefined}
              >
                <ImageIcon size={32} className="text-muted-foreground mb-2" />
                {isAdmin ? (
                  <p className="text-sm text-muted-foreground text-center px-4">
                    Click to add image
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">No image</p>
                )}
              </div>
            )}
            
            {/* Image overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            
            {/* Share button overlay */}
            {item.image && !isAdmin && (
              <div className="absolute bottom-3 right-3">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleShare}
                  className="h-8 w-8 p-0 rounded-full bg-black/50 hover:bg-black/70 text-white border-0 backdrop-blur-sm transition-all duration-200"
                  title="Share this item"
                >
                  <Share size={14} />
                </Button>
              </div>
            )}
          </div>
        )}

        <CardContent className="p-4 sm:p-5 lg:p-6">
          {/* Header section with title, price, and rating */}
          <div className="flex justify-between items-start mb-3 sm:mb-4 gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base sm:text-lg lg:text-xl text-foreground mb-1 break-words leading-tight text-balance">
                {item.name}
              </h3>
              
              {/* Rating and reviews */}
              {!isAdmin && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        weight={i < Math.floor(mockRating) ? "fill" : "regular"}
                        className={cn(
                          "transition-colors",
                          i < Math.floor(mockRating) ? "text-yellow-400" : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {mockRating.toFixed(1)} ({mockReviews})
                  </span>
                </div>
              )}
              
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed break-words line-clamp-3">
                {item.description}
              </p>
            </div>
            
            <div className="flex-shrink-0 text-right">
              <div className="font-bold text-accent text-xl sm:text-2xl drop-shadow-sm">
                ${price.toFixed(2)}
              </div>
              {isAdmin && (
                <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                  <div>AC: ${item.prices?.['dinein-ac'].toFixed(2) || '0.00'}</div>
                  <div>Non-AC: ${item.prices?.['dinein-non-ac'].toFixed(2) || '0.00'}</div>
                  <div>Takeaway: ${item.prices?.['takeaway'].toFixed(2) || '0.00'}</div>
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
              
              {/* Preparation time estimate */}
              {!isAdmin && item.available && (
                <Badge variant="outline" className="text-xs font-medium px-2 py-1 flex items-center gap-1">
                  <Clock size={10} />
                  {10 + (parseInt(item.id) % 20)} min
                </Badge>
              )}
            </div>
            
            {/* Enhanced dietary preferences indicators */}
            {item.dietary && item.dietary.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground font-medium">Dietary:</span>
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
                          "hover:scale-110 active:scale-95 cursor-help group/dietary"
                        )}
                        title={iconInfo.label}
                      >
                        <Icon 
                          size={14} 
                          className={cn(iconInfo.color, "group-hover/dietary:scale-110 transition-transform")} 
                          weight="duotone" 
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Enhanced Add to Cart button for customers */}
            {!isAdmin && onAddToCart && (
              <div className="pt-3 border-t border-border/50">
                <Button
                  onClick={handleAddToCart}
                  disabled={!item.available}
                  className={cn(
                    "w-full touch-target hover-lift transition-all duration-300 group/cart relative overflow-hidden",
                    isLiked && "animate-pulse bg-red-500 hover:bg-red-600"
                  )}
                  size="sm"
                >
                  <div className="flex items-center justify-center gap-2 relative z-10">
                    {isLiked ? (
                      <Heart size={16} weight="fill" className="text-white animate-bounce" />
                    ) : (
                      <Plus size={16} className="group-hover/cart:rotate-90 transition-transform duration-200" />
                    )}
                    <span className="font-medium">
                      {isLiked ? 'Added!' : 'Add to Cart'}
                    </span>
                  </div>
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/cart:translate-x-full transition-transform duration-500" />
                </Button>
              </div>
            )}

            {/* Enhanced Admin controls */}
            {isAdmin && (
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <div className="flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleToggleAvailability}
                    className={cn(
                      "h-8 w-8 p-0 touch-target-sm hover-lift transition-all duration-200",
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
                    className="h-8 w-8 p-0 touch-target-sm hover-lift hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-200"
                    title="Edit item"
                  >
                    <PencilSimple size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDelete}
                    className="h-8 w-8 p-0 touch-target-sm hover-lift hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
                    title="Delete item"
                  >
                    <Trash size={16} />
                  </Button>
                </div>
                
                {/* Image upload button */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8 w-8 p-0 touch-target-sm hover-lift hover:bg-primary/10 hover:text-primary transition-all duration-200"
                  title="Upload image"
                >
                  <Camera size={16} />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Image preview dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b border-border/50">
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <ImageIcon size={20} className="text-primary" />
              {item.name}
            </DialogTitle>
          </DialogHeader>
          
          {item.image && (
            <div className="relative h-[60vh] sm:h-[70vh] bg-black/5">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <EditItemDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        item={item}
        onSave={handleSave}
      />
    </>
  )
}