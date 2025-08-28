import { ReactNode, useRef, useEffect, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Circle, CircleDashed } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

interface HorizontalScrollProps {
  children: ReactNode
  className?: string
  showIndicators?: boolean
  showArrows?: boolean
  snapToCards?: boolean
  cardWidth?: number
  gap?: number
  itemCount?: number
  id?: string
  showScrollBar?: boolean
}

export function HorizontalScroll({ 
  children, 
  className,
  showIndicators = true,
  showArrows = false,
  snapToCards = true,
  cardWidth = 280,
  gap = 16,
  itemCount = 0,
  id = 'horizontal-scroll',
  showScrollBar = false
}: HorizontalScrollProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [visibleItems, setVisibleItems] = useState(0)

  const updateScrollState = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    const maxScroll = scrollWidth - clientWidth
    
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < maxScroll - 1) // -1 for floating point precision
    setScrollProgress(maxScroll > 0 ? Math.min(1, Math.max(0, scrollLeft / maxScroll)) : 0)

    // Calculate visible items with safety checks
    if (cardWidth && itemCount > 0 && typeof cardWidth === 'number' && typeof itemCount === 'number' && typeof gap === 'number') {
      const containerWidth = clientWidth
      const itemsVisible = Math.floor(containerWidth / (cardWidth + gap))
      setVisibleItems(Math.max(1, Math.min(itemsVisible, itemCount)))
    }
  }, [cardWidth, gap, itemCount])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    updateScrollState()

    // Throttled scroll handler for performance
    let throttleTimer: NodeJS.Timeout | null = null
    const handleScroll = () => {
      if (throttleTimer !== null) return
      
      throttleTimer = setTimeout(() => {
        updateScrollState()
        throttleTimer = null
      }, 16) // ~60fps
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', updateScrollState)

    return () => {
      container.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateScrollState)
      if (throttleTimer) clearTimeout(throttleTimer)
    }
  }, [updateScrollState])

  const scrollLeft = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = snapToCards ? cardWidth + gap : container.clientWidth * 0.8
    container.scrollBy({ 
      left: -scrollAmount, 
      behavior: 'smooth'
    })
  }, [snapToCards, cardWidth, gap])

  const scrollRight = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = snapToCards ? cardWidth + gap : container.clientWidth * 0.8
    container.scrollBy({ 
      left: scrollAmount, 
      behavior: 'smooth'
    })
  }, [snapToCards, cardWidth, gap])

  const scrollToProgress = useCallback((progress: number) => {
    const container = scrollContainerRef.current
    if (!container) return

    const maxScroll = container.scrollWidth - container.clientWidth
    container.scrollTo({
      left: maxScroll * progress,
      behavior: 'smooth'
    })
  }, [])

  return (
    <div className={cn("relative group", className)}>
      {/* Left Arrow */}
      {showArrows && canScrollLeft && (
        <Button
          variant="outline"
          size="sm"
          onClick={scrollLeft}
          className={cn(
            "absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-300",
            "bg-card/95 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl",
            "hover:scale-110 focus:ring-2 focus:ring-primary/30"
          )}
          aria-label="Scroll left"
        >
          <ChevronLeft size={16} />
        </Button>
      )}

      {/* Scroll Container */}
      <div
        ref={scrollContainerRef}
        className={cn(
          "flex overflow-x-auto pb-2 scroll-smooth",
          snapToCards && "snap-x snap-mandatory",
          showScrollBar ? "scrollbar-visible" : "scrollbar-hide"
        )}
      >
        {children}
      </div>

      {/* Right Arrow */}
      {showArrows && canScrollRight && (
        <Button
          variant="outline"
          size="sm"
          onClick={scrollRight}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-300",
            "bg-card/95 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl",
            "hover:scale-110 focus:ring-2 focus:ring-primary/30"
          )}
          aria-label="Scroll right"
        >
          <ChevronRight size={16} />
        </Button>
      )}

      {/* Left Fade Gradient */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-2 w-8 bg-gradient-to-r from-background via-background/90 to-transparent pointer-events-none z-10" />
      )}

      {/* Right Fade Gradient */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-background via-background/90 to-transparent pointer-events-none z-10" />
      )}

      {/* Scroll Indicators */}
      {showIndicators && itemCount > visibleItems && itemCount > 0 && (
        <div className="flex items-center justify-center gap-1 mt-3 sm:mt-4">
          {/* Progress Bar */}
          <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-full border border-border/50 backdrop-blur-sm">
            <div className="w-16 sm:w-24 h-1 bg-border/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>
            
            {/* Item Counter */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
              <span className="text-foreground">{Math.ceil(scrollProgress * Math.max(1, Math.floor(itemCount) - Math.floor(visibleItems) + 1)) || 1}</span>
              <span>/</span>
              <span>{Math.max(1, Math.floor(itemCount) - Math.floor(visibleItems) + 1)}</span>
            </div>
          </div>

          {/* Dot Indicators for fewer items */}
          {itemCount <= 8 && itemCount > 0 && visibleItems > 0 && (
            <div className="flex gap-1.5 ml-2">
              {Array.from({ length: Math.max(1, Math.floor(itemCount) - Math.floor(visibleItems) + 1) }).map((_, index) => {
                const maxIndex = Math.max(1, Math.floor(itemCount) - Math.floor(visibleItems))
                const progress = maxIndex > 0 ? index / maxIndex : 0
                const isActive = Math.abs(scrollProgress - progress) < 0.2
                
                return (
                  <button
                    key={index}
                    onClick={() => scrollToProgress(progress)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300 hover:scale-125 focus:ring-2 focus:ring-primary/30",
                      isActive 
                        ? "bg-primary shadow-sm" 
                        : "bg-border hover:bg-muted-foreground/50"
                    )}
                    aria-label={`Scroll to position ${index + 1}`}
                  />
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Mobile Scroll Hint - Only show when not using scroll bar */}
      {!showScrollBar && itemCount > visibleItems && (
        <div className="flex items-center justify-center mt-2 sm:hidden">
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/30">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-current rounded-full animate-pulse" />
              <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
            <span>Swipe to explore more</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Wrapper component for easier usage with cards
interface ScrollableCardContainerProps {
  children: ReactNode
  className?: string
  cardClassName?: string
  showIndicators?: boolean
  showArrows?: boolean
  cardWidth?: number
  gap?: number
  showScrollBar?: boolean
}

export function ScrollableCardContainer({
  children,
  className,
  cardClassName = "min-w-72 sm:min-w-80",
  showIndicators = true,
  showArrows = true,
  cardWidth = 280,
  gap = 16,
  showScrollBar = false
}: ScrollableCardContainerProps) {
  // Safely handle children conversion to array
  let childrenArray: ReactNode[] = []
  try {
    if (Array.isArray(children)) {
      childrenArray = children
    } else if (children) {
      childrenArray = [children]
    }
  } catch (error) {
    console.warn('Error processing children in ScrollableCardContainer:', error)
    childrenArray = []
  }
  
  const itemCount = childrenArray.filter(child => child != null).length

  return (
    <HorizontalScroll
      className={className}
      showIndicators={showIndicators}
      showArrows={showArrows}
      snapToCards={true}
      cardWidth={cardWidth}
      gap={gap}
      itemCount={itemCount}
      showScrollBar={showScrollBar}
    >
      <div className={cn("flex gap-4 px-1", cardClassName)}>
        {children}
      </div>
    </HorizontalScroll>
  )
}