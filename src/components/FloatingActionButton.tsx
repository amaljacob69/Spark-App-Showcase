import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { 
  DotsThreeVertical, 
  X, 
  GoogleLogo, 
  InstagramLogo, 
  ShoppingCart,
  MapPin,
  Phone,
  NavigationArrow,
  Copy,
  Star
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
  const [animateButtons, setAnimateButtons] = useState(false)
  const [isIdle, setIsIdle] = useState(false)

  // Auto-animate main button when idle (no interaction for 5 seconds)
  useEffect(() => {
    let idleTimer: NodeJS.Timeout
    
    const resetIdleTimer = () => {
      clearTimeout(idleTimer)
      setIsIdle(false)
      
      if (!isExpanded) {
        idleTimer = setTimeout(() => {
          setIsIdle(true)
        }, 5000) // 5 seconds of inactivity
      }
    }

    resetIdleTimer()
    
    // Reset idle timer on user interaction
    const events = ['click', 'touchstart', 'scroll', 'mousemove']
    events.forEach(event => {
      document.addEventListener(event, resetIdleTimer, { passive: true })
    })

    return () => {
      clearTimeout(idleTimer)
      events.forEach(event => {
        document.removeEventListener(event, resetIdleTimer)
      })
    }
  }, [isExpanded])
  
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
    setIsIdle(false) // Stop idle animation when user interacts
  }

  // Staggered animation effect for buttons
  useEffect(() => {
    if (isExpanded) {
      setAnimateButtons(true)
    } else {
      setAnimateButtons(false)
    }
  }, [isExpanded])

  return (
    <>
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <div className="flex flex-col items-end gap-3">
          {/* Action Buttons */}
          {isExpanded && (
            <div className="flex flex-col gap-3">
              {/* Google Review Button */}
              <div 
                className={`relative group transition-all duration-500 ease-out ${
                  animateButtons 
                    ? 'animate-in slide-in-from-right-8 fade-in-0 zoom-in-75' 
                    : 'animate-out slide-out-to-right-8 fade-out-0 zoom-out-75'
                }`}
                style={{ 
                  animationDelay: animateButtons ? '50ms' : '0ms',
                  animationFillMode: 'both'
                }}
              >
                <Button
                  size="icon"
                  className="h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg bg-red-500 hover:bg-red-600 text-white 
                           transition-all duration-300 ease-out touch-target group-hover:shadow-xl floating-button-ripple button-press-effect
                           hover:scale-110 hover:-translate-y-1"
                  onClick={handleGoogleReviewClick}
                  aria-label="Leave a Google Review"
                >
                  <GoogleLogo 
                    size={20} 
                    weight="bold" 
                    className="transition-transform duration-200 group-hover:scale-110 group-hover:rotate-12 group-hover:animate-pulse" 
                  />
                </Button>
                {/* Enhanced Tooltip */}
                <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 hidden lg:group-hover:block z-10">
                  <div className="bg-black/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap backdrop-blur-sm
                                shadow-lg border border-white/10 animate-in slide-in-from-right-2 fade-in-0 duration-200">
                    <div className="font-medium">Google Reviews</div>
                    <div className="text-white/80 text-[10px]">Rate our restaurant</div>
                  </div>
                </div>
              </div>

              {/* Instagram Button */}
              <div 
                className={`relative group transition-all duration-500 ease-out ${
                  animateButtons 
                    ? 'animate-in slide-in-from-right-8 fade-in-0 zoom-in-75' 
                    : 'animate-out slide-out-to-right-8 fade-out-0 zoom-out-75'
                }`}
                style={{ 
                  animationDelay: animateButtons ? '100ms' : '0ms',
                  animationFillMode: 'both'
                }}
              >
                <Button
                  size="icon"
                  className="h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 
                           hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white 
                           transition-all duration-300 ease-out touch-target group-hover:shadow-xl floating-button-ripple button-press-effect
                           hover:scale-110 hover:-translate-y-1"
                  onClick={handleInstagramClick}
                  aria-label="Follow us on Instagram"
                >
                  <InstagramLogo 
                    size={20} 
                    weight="fill" 
                    className="transition-transform duration-200 group-hover:scale-110 group-hover:rotate-12" 
                  />
                </Button>
                {/* Enhanced Tooltip */}
                <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 hidden lg:group-hover:block z-10">
                  <div className="bg-black/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap backdrop-blur-sm
                                shadow-lg border border-white/10 animate-in slide-in-from-right-2 fade-in-0 duration-200">
                    <div className="font-medium">Follow on Instagram</div>
                    <div className="text-white/80 text-[10px]">@paradisefamilyrestaurant</div>
                  </div>
                </div>
              </div>

              {/* Cart Button */}
              <div 
                className={`relative group transition-all duration-500 ease-out ${
                  animateButtons 
                    ? 'animate-in slide-in-from-right-8 fade-in-0 zoom-in-75' 
                    : 'animate-out slide-out-to-right-8 fade-out-0 zoom-out-75'
                }`}
                style={{ 
                  animationDelay: animateButtons ? '150ms' : '0ms',
                  animationFillMode: 'both'
                }}
              >
                <Button
                  size="icon"
                  className="h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground 
                           transition-all duration-300 ease-out touch-target group-hover:shadow-xl floating-button-ripple button-press-effect
                           hover:scale-110 hover:-translate-y-1"
                  onClick={handleCartClick}
                  aria-label={`Shopping cart${cartItemCount > 0 ? ` (${cartItemCount} items)` : ''}`}
                >
                  <ShoppingCart 
                    size={20} 
                    weight="bold" 
                    className="transition-transform duration-200 group-hover:scale-110" 
                  />
                </Button>
                {cartItemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-5 w-5 sm:h-6 sm:w-6 rounded-full p-0 
                             flex items-center justify-center text-xs font-bold animate-bounce shadow-lg"
                  >
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </Badge>
                )}
                {/* Enhanced Tooltip */}
                <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 hidden lg:group-hover:block z-10">
                  <div className="bg-black/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap backdrop-blur-sm
                                shadow-lg border border-white/10 animate-in slide-in-from-right-2 fade-in-0 duration-200">
                    <div className="font-medium">View Cart</div>
                    {cartItemCount > 0 && (
                      <div className="text-white/80 text-[10px]">{cartItemCount} items</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Phone Call Button */}
              <div 
                className={`relative group transition-all duration-500 ease-out ${
                  animateButtons 
                    ? 'animate-in slide-in-from-right-8 fade-in-0 zoom-in-75' 
                    : 'animate-out slide-out-to-right-8 fade-out-0 zoom-out-75'
                }`}
                style={{ 
                  animationDelay: animateButtons ? '200ms' : '0ms',
                  animationFillMode: 'both'
                }}
              >
                <Button
                  size="icon"
                  className="h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg bg-green-500 hover:bg-green-600 text-white 
                           transition-all duration-300 ease-out touch-target group-hover:shadow-xl floating-button-ripple button-press-effect
                           hover:scale-110 hover:-translate-y-1"
                  onClick={handlePhoneClick}
                  aria-label="Call for reservations"
                >
                  <Phone 
                    size={20} 
                    weight="bold" 
                    className="transition-transform duration-200 group-hover:scale-110 group-hover:rotate-12" 
                  />
                </Button>
                {/* Enhanced Tooltip */}
                <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 hidden lg:group-hover:block z-10">
                  <div className="bg-black/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap backdrop-blur-sm
                                shadow-lg border border-white/10 animate-in slide-in-from-right-2 fade-in-0 duration-200">
                    <div className="font-medium">Call Restaurant</div>
                    <div className="text-white/80 text-[10px]">For reservations</div>
                  </div>
                </div>
              </div>

              {/* Location Button */}
              <div 
                className={`relative group transition-all duration-500 ease-out ${
                  animateButtons 
                    ? 'animate-in slide-in-from-right-8 fade-in-0 zoom-in-75' 
                    : 'animate-out slide-out-to-right-8 fade-out-0 zoom-out-75'
                }`}
                style={{ 
                  animationDelay: animateButtons ? '250ms' : '0ms',
                  animationFillMode: 'both'
                }}
              >
                <Button
                  size="icon"
                  className="h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 text-white 
                           transition-all duration-300 ease-out touch-target group-hover:shadow-xl floating-button-ripple button-press-effect
                           hover:scale-110 hover:-translate-y-1"
                  onClick={handleLocationClick}
                  aria-label="View location and get directions"
                >
                  <MapPin 
                    size={20} 
                    weight="bold" 
                    className="transition-transform duration-200 group-hover:scale-110 group-hover:animate-pulse" 
                  />
                </Button>
                {/* Enhanced Tooltip */}
                <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 hidden lg:group-hover:block z-10">
                  <div className="bg-black/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap backdrop-blur-sm
                                shadow-lg border border-white/10 animate-in slide-in-from-right-2 fade-in-0 duration-200">
                    <div className="font-medium">Location & Directions</div>
                    <div className="text-white/80 text-[10px]">View map & get directions</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Main Toggle Button with improved visual indicators */}
          <Button
            size="icon"
            className={`h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-xl transition-all duration-500 ease-out touch-target
                       hover:shadow-2xl floating-button-ripple button-press-effect backdrop-blur-sm border-2 border-white/20
                       focus:ring-4 focus:ring-primary/30 focus:outline-none relative group ${
              isExpanded 
                ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground scale-110 rotate-45' 
                : `bg-gradient-to-br from-accent via-accent to-accent/90 hover:from-accent/90 hover:via-accent hover:to-accent 
                   text-accent-foreground hover:scale-110 hover:rotate-12 ${
                    isIdle ? 'floating-bounce pulse-glow' : ''
                  } ${cartItemCount > 0 && !isExpanded ? 'pulse-glow' : ''}`
            }`}
            onClick={toggleExpanded}
            aria-label={isExpanded ? 'Close menu' : 'Open quick actions menu'}
          >
            {/* Enhanced background gradient overlay */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            
            {/* Main button content with enhanced indicators */}
            <div className="relative flex items-center justify-center z-10">
              {isExpanded ? (
                <X 
                  size={24} 
                  weight="bold" 
                  className="transition-all duration-300 ease-out" 
                />
              ) : (
                <div className="relative">
                  <DotsThreeVertical 
                    size={24} 
                    weight="bold" 
                    className="transition-all duration-300 ease-out group-hover:rotate-90" 
                  />
                  {/* Enhanced cart indicator */}
                  {cartItemCount > 0 && (
                    <>
                      <div className="absolute -top-2 -right-2 h-3 w-3 bg-destructive rounded-full animate-bounce shadow-lg" />
                      <div className="absolute -top-2 -right-2 h-3 w-3 bg-destructive/50 rounded-full animate-ping" />
                    </>
                  )}
                  {/* Scroll hint indicators */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                    <div className="w-1 h-1 bg-current opacity-30 rounded-full animate-pulse" />
                    <div className="w-1 h-1 bg-current opacity-30 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-1 h-1 bg-current opacity-30 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Idle state pulsing ring */}
            {isIdle && !isExpanded && (
              <div className="absolute inset-0 rounded-full border-2 border-accent animate-ping opacity-20" />
            )}
          </Button>
        </div>

        {/* Enhanced Backdrop for mobile */}
        {isExpanded && (
          <div 
            className={`fixed inset-0 bg-black/20 backdrop-blur-sm -z-10 sm:hidden
                       animate-in fade-in-0 duration-300`}
            onClick={() => setIsExpanded(false)}
            aria-label="Close quick actions menu"
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
                      className="w-full justify-start gap-2 touch-target text-sm bg-red-50 hover:bg-red-100 border-red-200"
                    >
                      <GoogleLogo size={16} weight="bold" className="text-red-600" />
                      <span className="text-red-600 font-medium">
                        Google Reviews
                      </span>
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