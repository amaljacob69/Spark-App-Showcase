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
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-10 px-3 gap-2 justify-start font-medium transition-all duration-200",
                selectedFilters.length > 0 && "border-primary/50 bg-primary/5"
              )}
            >
              <Leaf size={16} />
              <span className="hidden sm:inline">Dietary Filters</span>
              <span className="sm:hidden">Filters</span>
              {selectedFilters.length > 0 && (
                <Badge variant="secondary" className="ml-auto min-w-0 px-1.5 py-0 text-xs">
                  {selectedFilters.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          
          <PopoverContent 
            className="w-80 p-4" 
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">Dietary Preferences</h4>
                {selectedFilters.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-6 px-2 text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </div>
              
              <Separator />
              
              <div className="grid gap-2">
                {dietaryOptions.map((option) => {
                  const Icon = option.icon
                  const isSelected = selectedFilters.includes(option.key)
                  
                  return (
                    <button
                      key={option.key}
                      onClick={() => toggleFilter(option.key)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 border",
                        "hover:scale-[1.02] active:scale-[0.98]",
                        isSelected 
                          ? `${option.bgColor} ${option.borderColor} ring-2 ring-primary/20` 
                          : "bg-card border-border hover:bg-muted/50"
                      )}
                    >
                      <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full",
                        isSelected ? option.bgColor : "bg-muted"
                      )}>
                        <Icon 
                          size={16} 
                          className={cn(
                            "transition-colors duration-200",
                            isSelected ? option.color : "text-muted-foreground"
                          )} 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-foreground">
                          {option.label}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {option.description}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
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
        <div className="flex flex-wrap gap-2">
          {selectedFilters.map((filter) => {
            const option = getOptionByKey(filter)
            if (!option) return null
            
            const Icon = option.icon
            return (
              <Badge
                key={filter}
                variant="secondary"
                className={cn(
                  "gap-1.5 py-1 px-2 transition-all duration-200 hover:scale-105",
                  option.bgColor,
                  option.borderColor,
                  "border"
                )}
              >
                <Icon size={12} className={option.color} />
                <span className="text-xs font-medium">{option.label}</span>
                <button
                  onClick={() => toggleFilter(filter)}
                  className="ml-1 hover:bg-background/20 rounded-full p-0.5 transition-colors duration-200"
                  aria-label={`Remove ${option.label} filter`}
                >
                  <X size={10} />
                </button>
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}