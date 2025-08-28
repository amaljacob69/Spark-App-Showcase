import { useState, useEffect } from 'react'
import { MenuItem, MenuType } from '../App'
import { MenuItemCard } from './MenuItemCard'
import { HorizontalScroll } from './HorizontalScroll'
import { Button } from './ui/button'
import { Star, TrendingUp, Clock, Award } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface HorizontalMenuSectionProps {
  title: string
  items: MenuItem[]
  menuType: MenuType
  getItemPrice: (item: MenuItem, type: MenuType) => number
  onAddToCart?: (item: MenuItem, menuType: MenuType) => void
  isAdmin?: boolean
  onEditItem?: (id: string, updates: Partial<MenuItem>) => void
  onDeleteItem?: (id: string) => void
  maxItems?: number
  sectionIcon?: 'star' | 'trending' | 'clock' | 'award'
  showViewAll?: boolean
  onViewAll?: () => void
}

export function HorizontalMenuSection({
  title,
  items,
  menuType,
  getItemPrice,
  onAddToCart,
  isAdmin = false,
  onEditItem,
  onDeleteItem,
  maxItems = 8,
  sectionIcon = 'star',
  showViewAll = true,
  onViewAll
}: HorizontalMenuSectionProps) {
  const [displayItems, setDisplayItems] = useState<MenuItem[]>([])

  useEffect(() => {
    const itemsToShow = items.slice(0, maxItems)
    setDisplayItems(itemsToShow)
  }, [items, maxItems])

  const getIcon = () => {
    const iconMap = {
      star: Star,
      trending: TrendingUp,
      clock: Clock,
      award: Award
    }
    return iconMap[sectionIcon]
  }

  const Icon = getIcon()

  if (displayItems.length === 0) {
    return null
  }

  return (
    <section className="space-y-4 sm:space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-8 h-8 bg-primary/15 rounded-lg group-hover:bg-primary/20 transition-colors">
            <Icon size={16} className="text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg sm:text-xl font-display font-bold text-foreground">
              {title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{displayItems.length} items</span>
            </div>
          </div>
        </div>
        
        {showViewAll && items.length > maxItems && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            className="text-sm hover-lift gap-1"
          >
            <span>View All</span>
            <span className="text-primary font-semibold">({items.length})</span>
          </Button>
        )}
      </div>

      {/* Horizontal Scrolling Menu Items */}
      <HorizontalScroll
        showIndicators={false}
        showArrows={true}
        cardWidth={280}
        gap={16}
        itemCount={displayItems.length}
        className="menu-items-scroll"
        showScrollBar={true}
      >
        <div className="flex gap-4 px-2 pb-2">
          {displayItems.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "min-w-72 sm:min-w-80 snap-start",
                "stagger-fade-in"
              )}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <MenuItemCard
                item={item}
                menuType={menuType}
                getItemPrice={getItemPrice}
                isAdmin={isAdmin}
                onEdit={onEditItem || (() => {})}
                onDelete={onDeleteItem || (() => {})}
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>
      </HorizontalScroll>

      {/* Quick stats or features */}
      <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Fresh ingredients</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <span>Made to order</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <span>Chef's choice</span>
        </div>
      </div>
    </section>
  )
}

// Specialized components for different sections
export function FeaturedMenuSection(props: Omit<HorizontalMenuSectionProps, 'title' | 'sectionIcon'>) {
  return (
    <HorizontalMenuSection
      {...props}
      title="Featured Dishes"
      sectionIcon="star"
    />
  )
}

export function PopularMenuSection(props: Omit<HorizontalMenuSectionProps, 'title' | 'sectionIcon'>) {
  return (
    <HorizontalMenuSection
      {...props}
      title="Most Popular"
      sectionIcon="trending"
    />
  )
}

export function RecentMenuSection(props: Omit<HorizontalMenuSectionProps, 'title' | 'sectionIcon'>) {
  return (
    <HorizontalMenuSection
      {...props}
      title="Recently Added"
      sectionIcon="clock"
    />
  )
}

export function ChefSpecialSection(props: Omit<HorizontalMenuSectionProps, 'title' | 'sectionIcon'>) {
  return (
    <HorizontalMenuSection
      {...props}
      title="Chef's Special"
      sectionIcon="award"
    />
  )
}