import { useState } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  Plus, 
  X, 
  Star, 
  InstagramLogo, 
  ShoppingCart,
  MapPin 
} from '@phosphor-icons/react'

interface FloatingActionButtonProps {
  cartItemCount?: number
  onCartClick?: () => void
}

export function FloatingActionButton({ 
  cartItemCount = 0,
  onCartClick 
}: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleGoogleReviewClick = () => {
    // Paradise Family Restaurant & Bake shop - Google Business listing
    const googleReviewUrl = 'https://search.google.com/local/writereview?placeid=ChIJGcnxTmwCCDsRbR1By6fYbFc'
    window.open(googleReviewUrl, '_blank', 'noopener,noreferrer')
    setIsExpanded(false)
  }

  const handleInstagramClick = () => {
    // Paradise Family Restaurant & Bake shop - Instagram location page
    const instagramUrl = 'https://www.instagram.com/explore/locations/1026441532/chalakudy-paradise-restaurant/'
    window.open(instagramUrl, '_blank', 'noopener,noreferrer')
    setIsExpanded(false)
  }

  const handleCartClick = () => {
    onCartClick?.()
    setIsExpanded(false)
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <div className="flex flex-col items-end gap-3">
        {/* Action Buttons */}
        {isExpanded && (
          <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-2 duration-200">
            {/* Cart Button */}
            <div className="relative">
              <Button
                size="icon"
                className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-110 transition-all duration-200"
                onClick={handleCartClick}
                aria-label={`Shopping cart${cartItemCount > 0 ? ` (${cartItemCount} items)` : ''}`}
              >
                <ShoppingCart size={20} weight="bold" />
              </Button>
              {cartItemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold animate-pulse"
                >
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </Badge>
              )}
            </div>

            {/* Google Review Button */}
            <Button
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg bg-yellow-500 hover:bg-yellow-600 text-white hover:scale-110 transition-all duration-200"
              onClick={handleGoogleReviewClick}
              aria-label="Leave a Google Review"
            >
              <Star size={20} weight="fill" />
            </Button>

            {/* Instagram Button */}
            <Button
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white hover:scale-110 transition-all duration-200"
              onClick={handleInstagramClick}
              aria-label="Follow us on Instagram"
            >
              <InstagramLogo size={20} weight="fill" />
            </Button>
          </div>
        )}

        {/* Main Toggle Button */}
        <Button
          size="icon"
          className={`h-14 w-14 rounded-full shadow-xl transition-all duration-300 ${
            isExpanded 
              ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground rotate-45' 
              : 'bg-accent hover:bg-accent/90 text-accent-foreground hover:scale-110'
          }`}
          onClick={toggleExpanded}
          aria-label={isExpanded ? 'Close action menu' : 'Open action menu'}
        >
          {isExpanded ? (
            <X size={24} weight="bold" />
          ) : (
            <div className="relative">
              <Plus size={24} weight="bold" />
              {cartItemCount > 0 && (
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full animate-pulse" />
              )}
            </div>
          )}
        </Button>
      </div>

      {/* Backdrop for mobile */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10 sm:hidden"
          onClick={() => setIsExpanded(false)}
          aria-label="Close action menu"
        />
      )}
    </div>
  )
}