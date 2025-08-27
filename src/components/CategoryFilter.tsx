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
      <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center sm:justify-start">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onCategorySelect(category)}
            className={cn(
              "transition-all duration-200 text-xs px-2.5 py-1.5 sm:px-3 sm:py-2 min-w-0",
              selectedCategory === category 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "hover:bg-muted"
            )}
          >
            {formatCategoryName(category)}
          </Button>
        ))}
      </div>
    </div>
  )
}