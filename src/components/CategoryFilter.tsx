import { Button } from './ui/button'
import { cn } from '@/lib/utils'

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

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onCategorySelect(category)}
            className={cn(
              "transition-all duration-200 text-xs sm:text-sm px-3 py-2 min-w-0 touch-target-sm hover-lift",
              "whitespace-nowrap font-medium",
              selectedCategory === category 
                ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20 scale-105" 
                : "hover:bg-muted hover:scale-105 active:scale-95"
            )}
          >
            {formatCategoryName(category)}
          </Button>
        ))}
      </div>
    </div>
  )
}