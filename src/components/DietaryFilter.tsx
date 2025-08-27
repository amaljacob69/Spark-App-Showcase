import { useState } from 'react'
import { Leaf, Egg, Bird, Cow, Fish, X } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Separator } from './ui/separator'
import { cn } from '@/lib/utils'

export type DietaryPreference = 'vegetarian' | 'egg' | 'chicken' | 'meat' | 'fish'

interface DietaryFilterProps {
  selectedFilters: DietaryPreference[]
  onFiltersChange: (filters: DietaryPreference[]) => void
  className?: string
}

const dietaryOptions = [
  {
    key: 'vegetarian' as DietaryPreference,
    label: 'Vegetarian',
    icon: Leaf,
    color: 'text-green-600',
    bgColor: 'bg-green-50 hover:bg-green-100',
    borderColor: 'border-green-200',
    description: 'Plant-based dishes'
  },
  {
    key: 'egg' as DietaryPreference,
    label: 'Contains Egg',
    icon: Egg,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 hover:bg-yellow-100',
    borderColor: 'border-yellow-200',
    description: 'Dishes with eggs'
  },
  {
    key: 'chicken' as DietaryPreference,
    label: 'Chicken',
    icon: Bird,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 hover:bg-amber-100',
    borderColor: 'border-amber-200',
    description: 'Chicken-based dishes'
  },
  {
    key: 'meat' as DietaryPreference,
    label: 'Meat',
    icon: Cow,
    color: 'text-red-600',
    bgColor: 'bg-red-50 hover:bg-red-100',
    borderColor: 'border-red-200',
    description: 'Beef, pork, lamb dishes'
  },
  {
    key: 'fish' as DietaryPreference,
    label: 'Fish & Seafood',
    icon: Fish,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
    borderColor: 'border-blue-200',
    description: 'Fish and seafood dishes'
  }
]

export function DietaryFilter({ selectedFilters, onFiltersChange, className }: DietaryFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleFilter = (filter: DietaryPreference) => {
    if (selectedFilters.includes(filter)) {
      onFiltersChange(selectedFilters.filter(f => f !== filter))
    } else {
      onFiltersChange([...selectedFilters, filter])
    }
  }

  const clearAllFilters = () => {
    onFiltersChange([])
    setIsOpen(false)
  }

  const getOptionByKey = (key: DietaryPreference) => 
    dietaryOptions.find(option => option.key === key)

  return (
    <div className={cn("flex flex-col gap-3 sm:gap-4", className)}>
      <div className="flex items-center justify-between">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              className={cn(
                "h-12 sm:h-14 px-4 sm:px-6 gap-3 justify-start font-medium transition-all duration-300 touch-target hover-lift",
                "focus:ring-2 focus:ring-primary/30",
                selectedFilters.length > 0 && "border-primary/50 bg-primary/10 shadow-md scale-105"
              )}
            >
              <Leaf size={18} />
              <span className="text-sm sm:text-base">Dietary Filters</span>
              {selectedFilters.length > 0 && (
                <Badge variant="secondary" className="ml-auto min-w-0 px-2 py-1 text-xs font-bold">
                  {selectedFilters.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          
          <PopoverContent 
            className="w-80 sm:w-96 p-4 sm:p-6 bg-popover/95 backdrop-blur-sm" 
            align="start"
            side="bottom"
            sideOffset={8}
          >
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-base sm:text-lg">Dietary Preferences</h4>
                {selectedFilters.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-8 px-3 text-xs hover-lift"
                  >
                    Clear all
                  </Button>
                )}
              </div>
              
              <Separator />
              
              <div className="grid gap-3">
                {dietaryOptions.map((option) => {
                  const Icon = option.icon
                  const isSelected = selectedFilters.includes(option.key)
                  
                  return (
                    <button
                      key={option.key}
                      onClick={() => toggleFilter(option.key)}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-lg text-left transition-all duration-300 border-2 touch-target",
                        "hover:scale-[1.02] active:scale-[0.98]",
                        isSelected 
                          ? `${option.bgColor} ${option.borderColor} ring-2 ring-primary/30 shadow-md` 
                          : "bg-card border-border hover:bg-muted/50 hover:border-muted-foreground/30"
                      )}
                    >
                      <div className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200",
                        isSelected ? option.bgColor : "bg-muted"
                      )}>
                        <Icon 
                          size={20} 
                          weight={isSelected ? "duotone" : "regular"}
                          className={cn(
                            "transition-colors duration-200",
                            isSelected ? option.color : "text-muted-foreground"
                          )} 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm sm:text-base text-foreground">
                          {option.label}
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                          {option.description}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Selected filters display */}
      {selectedFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {selectedFilters.map((filter) => {
            const option = getOptionByKey(filter)
            if (!option) return null
            
            const Icon = option.icon
            return (
              <Badge
                key={filter}
                variant="secondary"
                className={cn(
                  "gap-2 py-2 px-3 text-xs sm:text-sm transition-all duration-200 hover:scale-105 touch-target-sm",
                  option.bgColor,
                  option.borderColor,
                  "border-2 font-medium"
                )}
              >
                <Icon size={14} className={option.color} weight="duotone" />
                <span>{option.label}</span>
                <button
                  onClick={() => toggleFilter(filter)}
                  className="ml-1 hover:bg-background/30 rounded-full p-1 transition-colors duration-200"
                  aria-label={`Remove ${option.label} filter`}
                >
                  <X size={12} />
                </button>
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}