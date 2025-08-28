import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { 
  ForkKnife, 
  Egg, 
  Leaf, 
  Fish, 
  Cow, 
  Bird, 
  Martini,
  Cookie,
  Salad,
  Bread,
  Star,
  GridFour
} from '@phosphor-icons/react'

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string
  onCategorySelect: (category: string) => void
}

export function CategoryFilter({ categories, selectedCategory, onCategorySelect }: CategoryFilterProps) {
  const formatCategoryName = (category: string) => {
    if (category === 'all') return 'All Items'
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  const getCategoryIcon = (category: string) => {
    const iconSize = 14
    const iconClass = "sm:size-4 flex-shrink-0"
    
    switch (category.toLowerCase()) {
      case 'all':
        return <GridFour size={iconSize} className={iconClass} />
      case 'chicken':
        return <Bird size={iconSize} className={iconClass} />
      case 'meat':
        return <Cow size={iconSize} className={iconClass} />
      case 'fish':
        return <Fish size={iconSize} className={iconClass} />
      case 'vegetarian':
        return <Leaf size={iconSize} className={iconClass} />
      case 'appetizers':
        return <ForkKnife size={iconSize} className={iconClass} />
      case 'salads':
        return <Salad size={iconSize} className={iconClass} />
      case 'desserts':
        return <Cookie size={iconSize} className={iconClass} />
      case 'pasta':
        return <Bread size={iconSize} className={iconClass} />
      case 'beverages':
        return <Martini size={iconSize} className={iconClass} />
      default:
        return <Star size={iconSize} className={iconClass} />
    }
  }

  const getCategoryGradient = (category: string, isSelected: boolean) => {
    const gradients = {
      'all': isSelected ? 'from-slate-600 to-slate-800' : 'from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200',
      'chicken': isSelected ? 'from-amber-600 to-orange-700' : 'from-amber-50 to-orange-100 hover:from-amber-100 hover:to-orange-200',
      'meat': isSelected ? 'from-red-600 to-red-800' : 'from-red-50 to-red-100 hover:from-red-100 hover:to-red-200',
      'fish': isSelected ? 'from-blue-600 to-cyan-700' : 'from-blue-50 to-cyan-100 hover:from-blue-100 hover:to-cyan-200',
      'vegetarian': isSelected ? 'from-green-600 to-emerald-700' : 'from-green-50 to-emerald-100 hover:from-green-100 hover:to-emerald-200',
      'appetizers': isSelected ? 'from-purple-600 to-violet-700' : 'from-purple-50 to-violet-100 hover:from-purple-100 hover:to-violet-200',
      'salads': isSelected ? 'from-lime-600 to-green-700' : 'from-lime-50 to-green-100 hover:from-lime-100 hover:to-green-200',
      'desserts': isSelected ? 'from-pink-600 to-rose-700' : 'from-pink-50 to-rose-100 hover:from-pink-100 hover:to-rose-200',
      'pasta': isSelected ? 'from-yellow-600 to-amber-700' : 'from-yellow-50 to-amber-100 hover:from-yellow-100 hover:to-amber-200',
      'beverages': isSelected ? 'from-indigo-600 to-blue-700' : 'from-indigo-50 to-blue-100 hover:from-indigo-100 hover:to-blue-200'
    }
    
    return gradients[category.toLowerCase()] || (isSelected ? 'from-gray-600 to-gray-800' : 'from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200')
  }

  const getCategoryTextColor = (category: string, isSelected: boolean) => {
    if (isSelected) return 'text-white'
    
    const textColors = {
      'all': 'text-slate-700',
      'chicken': 'text-amber-700',
      'meat': 'text-red-700',
      'fish': 'text-blue-700',
      'vegetarian': 'text-green-700',
      'appetizers': 'text-purple-700',
      'salads': 'text-lime-700',
      'desserts': 'text-pink-700',
      'pasta': 'text-yellow-700',
      'beverages': 'text-indigo-700'
    }
    
    return textColors[category.toLowerCase()] || 'text-gray-700'
  }

  return (
    <div className="w-full">
      {/* Enhanced category section header */}
      <div className="mb-3 sm:mb-4 text-center sm:text-left">
        <h3 className="text-sm font-semibold text-muted-foreground flex items-center justify-center sm:justify-start gap-3 group">
          <div className="flex items-center justify-center w-7 h-7 bg-primary/15 rounded-lg group-hover:bg-primary/20 transition-colors">
            <GridFour size={16} className="text-primary" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Browse Categories
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent hidden sm:block ml-3" />
        </h3>
      </div>

      {/* Enhanced category buttons with scroll container */}
      <div className="relative">
        <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-2 px-1 sm:px-0 justify-start scroll-smooth">
          {categories.map((category, index) => {
            const isSelected = selectedCategory === category
            return (
              <button
                key={category}
                onClick={() => onCategorySelect(category)}
                className={cn(
                  "group relative flex items-center gap-2 px-4 py-3 rounded-xl category-smooth-transition touch-target-sm category-button-glow",
                  "font-medium text-sm whitespace-nowrap min-w-fit transform hover:scale-105 active:scale-95",
                  "bg-gradient-to-r shadow-sm border backdrop-blur-sm",
                  "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2",
                  getCategoryGradient(category, isSelected),
                  getCategoryTextColor(category, isSelected),
                  isSelected 
                    ? "border-white/20 shadow-lg ring-2 ring-white/30 scale-105" 
                    : "border-border/40 hover:border-border/60 hover:shadow-md",
                  "stagger-fade-in"
                )}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Icon */}
                <div className={cn(
                  "flex items-center justify-center category-smooth-transition",
                  isSelected ? "text-white/90" : "text-current opacity-70 group-hover:opacity-100"
                )}>
                  {getCategoryIcon(category)}
                </div>

                {/* Label */}
                <span className="font-medium">
                  {formatCategoryName(category)}
                </span>

                {/* Selection indicator with pulse effect */}
                {isSelected && (
                  <>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-white/20 to-white/10 rounded-xl blur-sm -z-10" />
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-white/10 to-white/5 rounded-xl animate-pulse -z-20" />
                  </>
                )}

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 category-smooth-transition bg-gradient-to-r from-white/5 to-white/10 pointer-events-none" />
                
                {/* Ripple effect on click */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-active:opacity-30 transition-opacity duration-150 bg-white/20 pointer-events-none" />
              </button>
            )
          })}
        </div>

        {/* Enhanced fade out indicators for scrollable content */}
        <div className="absolute left-0 top-0 bottom-2 w-6 bg-gradient-to-r from-background via-background/80 to-transparent pointer-events-none sm:hidden z-10" />
        <div className="absolute right-0 top-0 bottom-2 w-6 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none sm:hidden z-10" />
        
        {/* Scroll indicators */}
        <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-transparent via-primary/30 to-transparent rounded-full opacity-50 sm:hidden animate-pulse" />
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-transparent via-primary/30 to-transparent rounded-full opacity-50 sm:hidden animate-pulse" />
      </div>

      {/* Enhanced active category indicator */}
      {selectedCategory !== 'all' && (
        <div className="mt-3 sm:mt-4 flex items-center justify-center sm:justify-start">
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/15 to-primary/10 text-primary rounded-full text-xs font-medium border border-primary/25 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-center w-5 h-5 bg-primary/20 rounded-full">
              {getCategoryIcon(selectedCategory)}
            </div>
            <span>Showing:</span>
            <span className="font-bold">{formatCategoryName(selectedCategory)}</span>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse ml-1" />
          </div>
        </div>
      )}
    </div>
  )
}