import { useState } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { 
  Plus, 
  X, 
  Star, 
  InstagramLogo, 
  ShoppingCart,
  MapPin,
  Phone,
  NavigationArrow,
  Copy
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface FloatingActionButtonProps {
  cartItemCount?: number
  onCartClick?: () => void
}

export function FloatingActionButton({ 
  cartItemCount = 0,
  onCartClick 
}: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showLocationDialog, setShowLocationDialog] = useState(false)
  
  // Restaurant details
  const restaurantDetails = {
    name: 'Paradise Family Restaurant & Bake Shop',
    address: 'Chalakudy, Kerala, India',
    phone: '+91 480 271 2345',
    coordinates: { lat: 10.311468467596864, lng: 76.3343773754989 },
    placeId: 'ChIJGcnxTmwCCDsRbR1By6fYbFc',
    instagram: 'https://www.instagram.com/explore/locations/1026441532/chalakudy-paradise-restaurant/'
  }

  const handleGoogleReviewClick = () => {
    // Paradise Family Restaurant & Bake shop - Google Business listing
    const googleReviewUrl = `https://search.google.com/local/writereview?placeid=${restaurantDetails.placeId}`
    window.open(googleReviewUrl, '_blank', 'noopener,noreferrer')
    setIsExpanded(false)
  }

  const handleInstagramClick = () => {
    // Paradise Family Restaurant & Bake shop - Instagram location page
    window.open(restaurantDetails.instagram, '_blank', 'noopener,noreferrer')
    setIsExpanded(false)
  }

  const handlePhoneClick = () => {
    // Paradise Family Restaurant phone number for reservations
    const phoneNumber = `tel:${restaurantDetails.phone}`
    window.location.href = phoneNumber
    setIsExpanded(false)
  }

  const handleLocationClick = () => {
    // Show location dialog instead of direct link
    setShowLocationDialog(true)
    setIsExpanded(false)
  }

  const handleDirectionsClick = () => {
    // Open Google Maps directions
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${restaurantDetails.coordinates.lat},${restaurantDetails.coordinates.lng}&destination_place_id=${restaurantDetails.placeId}`
    window.open(directionsUrl, '_blank', 'noopener,noreferrer')
  }

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(restaurantDetails.address)
      toast.success('Address copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy address')
    }
  }

  const handleCartClick = () => {
    onCartClick?.()
    setIsExpanded(false)
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <div className="flex flex-col items-end gap-3">
          {/* Action Buttons */}
          {isExpanded && (
            <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-2 duration-200">
              {/* Cart Button */}
              <div className="relative group">
                <Button
                  size="icon"
                  className="h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-110 transition-all duration-200 touch-target"
                  onClick={handleCartClick}
                  aria-label={`Shopping cart${cartItemCount > 0 ? ` (${cartItemCount} items)` : ''}`}
                >
                  <ShoppingCart size={20} weight="bold" />
                </Button>
                {cartItemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-5 w-5 sm:h-6 sm:w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold animate-pulse"
                  >
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </Badge>
                )}
                {/* Tooltip - hidden on mobile */}
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden sm:group-hover:block">
                  <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap backdrop-blur-sm">
                    View Cart {cartItemCount > 0 && `(${cartItemCount})`}
                  </div>
                </div>
              </div>

              {/* Phone Call Button */}
              <div className="relative group">
                <Button
                  size="icon"
                  className="h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg bg-green-500 hover:bg-green-600 text-white hover:scale-110 transition-all duration-200 touch-target"
                  onClick={handlePhoneClick}
                  aria-label="Call for reservations"
                >
                  <Phone size={20} weight="bold" />
                </Button>
                {/* Tooltip - hidden on mobile */}
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden sm:group-hover:block">
                  <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap backdrop-blur-sm">
                    Call Restaurant
                  </div>
                </div>
              </div>

              {/* Location Button */}
              <div className="relative group">
                <Button
                  size="icon"
                  className="h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 text-white hover:scale-110 transition-all duration-200 touch-target"
                  onClick={handleLocationClick}
                  aria-label="View location and get directions"
                >
                  <MapPin size={20} weight="bold" />
                </Button>
                {/* Tooltip - hidden on mobile */}
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden sm:group-hover:block">
                  <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap backdrop-blur-sm">
                    Location & Directions
                  </div>
                </div>
              </div>

              {/* Google Review Button */}
              <div className="relative group">
                <Button
                  size="icon"
                  className="h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg bg-yellow-500 hover:bg-yellow-600 text-white hover:scale-110 transition-all duration-200 touch-target"
                  onClick={handleGoogleReviewClick}
                  aria-label="Leave a Google Review"
                >
                  <Star size={20} weight="fill" />
                </Button>
                {/* Tooltip - hidden on mobile */}
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden sm:group-hover:block">
                  <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap backdrop-blur-sm">
                    Leave Review
                  </div>
                </div>
              </div>

              {/* Instagram Button */}
              <div className="relative group">
                <Button
                  size="icon"
                  className="h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white hover:scale-110 transition-all duration-200 touch-target"
                  onClick={handleInstagramClick}
                  aria-label="Follow us on Instagram"
                >
                  <InstagramLogo size={20} weight="fill" />
                </Button>
                {/* Tooltip - hidden on mobile */}
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden sm:group-hover:block">
                  <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap backdrop-blur-sm">
                    Follow on Instagram
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Toggle Button */}
          <Button
            size="icon"
            className={`h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-xl transition-all duration-300 touch-target ${
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

      {/* Enhanced Location Dialog */}
      <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-border/50">
            <DialogTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              <MapPin className="text-primary" size={20} sm:size={24} weight="bold" />
              <span className="text-sm sm:text-base lg:text-lg break-words">
                {restaurantDetails.name}
              </span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col lg:flex-row h-[60vh] sm:h-[70vh] lg:h-[600px]">
            {/* Map Section */}
            <div className="flex-1 relative min-h-[300px] lg:min-h-0">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3925.3796772112187!2d76.3343773754989!3d10.311468467596864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b08026c4ef1c919%3A0x576cd8a7cb411d6d!2sParadise%20Family%20Restaurant%20%26%20Bake%20shop!5e0!3m2!1sen!2sin!4v1756316430948!5m2!1sen!2sin"
                width="100%"
                height="100%" 
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Paradise Family Restaurant Location"
                className="rounded-none lg:rounded-lg"
              />
            </div>

            {/* Restaurant Details Sidebar */}
            <div className="lg:w-80 p-4 sm:p-6 bg-muted/30 border-t lg:border-t-0 lg:border-l border-border/50 flex flex-col gap-4 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-base sm:text-lg mb-2">Location Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium leading-tight">{restaurantDetails.address}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyAddress}
                          className="h-auto p-1 text-xs text-primary hover:text-primary/80 mt-1 touch-target-sm"
                        >
                          <Copy size={12} className="mr-1" />
                          Copy Address
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-muted-foreground flex-shrink-0" />
                      <span className="break-all">{restaurantDetails.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-4">
                  <h4 className="font-medium mb-3 text-sm sm:text-base">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button
                      onClick={handleDirectionsClick}
                      className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 touch-target text-sm"
                    >
                      <NavigationArrow size={16} weight="bold" />
                      Get Directions
                    </Button>
                    
                    <Button
                      onClick={handlePhoneClick}
                      variant="outline"
                      className="w-full justify-start gap-2 touch-target text-sm"
                    >
                      <Phone size={16} weight="bold" />
                      Call Restaurant
                    </Button>
                    
                    <Button
                      onClick={() => {
                        handleGoogleReviewClick()
                        setShowLocationDialog(false)
                      }}
                      variant="outline"
                      className="w-full justify-start gap-2 touch-target text-sm"
                    >
                      <Star size={16} weight="fill" />
                      Leave Review
                    </Button>
                    
                    <Button
                      onClick={() => {
                        handleInstagramClick()
                        setShowLocationDialog(false)
                      }}
                      variant="outline"
                      className="w-full justify-start gap-2 touch-target text-sm bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200"
                    >
                      <InstagramLogo size={16} weight="fill" className="text-purple-600" />
                      <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-medium">
                        Follow Instagram
                      </span>
                    </Button>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-4">
                  <h4 className="font-medium mb-3 text-sm sm:text-base">Business Hours</h4>
                  <div className="text-sm space-y-1.5 text-muted-foreground">
                    <p className="font-medium">Monday - Sunday</p>
                    <p className="text-foreground font-semibold">11:00 AM - 10:30 PM</p>
                    <div className="flex items-center gap-1 mt-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <p className="text-xs text-green-600 font-medium">Open Now</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      *Hours may vary on holidays
                    </p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="border-t border-border/50 pt-4 pb-2">
                  <h4 className="font-medium mb-3 text-sm sm:text-base">Features</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      Dine-in
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Takeaway
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      Family Friendly
                    </span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      Bakery
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}