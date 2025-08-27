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
      "relative group transition-all duration-200",
      isFocused && "scale-[1.02]",
      className
    )}>
      <div className="relative">
        <MagnifyingGlass 
          size={18} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary" 
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "pl-10 pr-10 h-11 transition-all duration-200",
            "focus:ring-2 focus:ring-primary/20 focus:border-primary",
            "hover:border-muted-foreground/50",
            query && "pr-12"
          )}
          role="searchbox"
          aria-label="Search menu items"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted/80"
            aria-label="Clear search"
          >
            <X size={14} />
          </Button>
        )}
      </div>
      
      {/* Search suggestions/hints */}
      {isFocused && !query && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg p-2 text-sm text-muted-foreground z-50">
          <div className="text-xs">Try searching for "salmon", "vegetarian", or "dessert"</div>
        </div>
      )}
    </div>
  )
}