import { useState, useEffect } from 'react'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  onSearch: (query: string) => void
  className?: string
  placeholder?: string
}

export function SearchBar({ onSearch, className, placeholder = "Search menu items..." }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    // Debounce search to avoid excessive calls
    const timer = setTimeout(() => {
      onSearch(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, onSearch])

  const clearSearch = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <div className={cn(
      "relative group transition-all duration-300",
      isFocused && "scale-[1.02] z-10",
      className
    )}>
      <div className="relative">
        <MagnifyingGlass 
          size={20} 
          className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground transition-all duration-200 group-focus-within:text-primary group-focus-within:scale-110" 
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "pl-11 sm:pl-12 pr-12 h-12 sm:h-14 text-base transition-all duration-300",
            "focus:ring-2 focus:ring-primary/30 focus:border-primary focus:shadow-lg",
            "hover:border-muted-foreground/50 hover:shadow-md",
            "bg-background/80 backdrop-blur-sm",
            query && "pr-14"
          )}
          role="searchbox"
          aria-label="Search menu items"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted/80 touch-target-sm"
            aria-label="Clear search"
          >
            <X size={16} />
          </Button>
        )}
      </div>
      
      {/* Enhanced search suggestions/hints */}
      {isFocused && !query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-4 text-sm text-muted-foreground z-50 animate-in slide-in-from-top-2">
          <div className="text-xs font-medium mb-2">Popular searches:</div>
          <div className="flex flex-wrap gap-1.5">
            {['salmon', 'vegetarian', 'chicken', 'dessert', 'pasta'].map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="text-xs px-2 py-1 bg-muted/50 rounded-md hover:bg-muted transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}