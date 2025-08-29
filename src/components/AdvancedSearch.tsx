import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Separator } from './ui/separator'
import { 
  MagnifyingGlass, 
  X, 
  Microphone, 
  MicrophoneSlash,
  Funnel,
  SortAscending,
  SortDescending,
  Star,
  Clock,
  TrendUp,
  Heart
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { DietaryPreference } from './DietaryFilter'

interface AdvancedSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedFilters: DietaryPreference[]
  onFiltersChange: (filters: DietaryPreference[]) => void
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  totalItems: number
  filteredItemsCount: number
  className?: string
}

type SortOption = 'name' | 'price-low' | 'price-high' | 'category' | 'availability'
type FilterTag = 'popular' | 'new' | 'trending' | 'favorites' | 'available-only'

export function AdvancedSearch({
  searchQuery,
  onSearchChange,
  selectedFilters,
  onFiltersChange,
  categories,
  selectedCategory,
  onCategoryChange,
  totalItems,
  filteredItemsCount,
  className
}: AdvancedSearchProps) {
  const [isListening, setIsListening] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [selectedTags, setSelectedTags] = useState<FilterTag[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'
      
      recognition.onstart = () => {
        setIsListening(true)
      }
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        onSearchChange(transcript)
        toast.success(`Voice search: "${transcript}"`)
      }
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        toast.error('Voice search failed. Please try again.')
      }
      
      recognition.onend = () => {
        setIsListening(false)
      }
      
      setRecognition(recognition)
    }
  }, [onSearchChange])

  const handleVoiceSearch = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop()
      } else {
        recognition.start()
      }
    } else {
      toast.error('Voice search is not supported in this browser')
    }
  }

  const handleTagToggle = (tag: FilterTag) => {
    setSelectedTags(current => 
      current.includes(tag) 
        ? current.filter(t => t !== tag)
        : [...current, tag]
    )
  }

  const handleClearAll = () => {
    onSearchChange('')
    onFiltersChange([])
    onCategoryChange('all')
    setSelectedTags([])
    setSortBy('name')
    setSortOrder('asc')
    setPriceRange([0, 100])
    toast.success('All filters cleared')
  }

  const activeFiltersCount = [
    searchQuery ? 1 : 0,
    selectedFilters.length,
    selectedCategory !== 'all' ? 1 : 0,
    selectedTags.length,
    sortBy !== 'name' ? 1 : 0
  ].reduce((sum, count) => sum + count, 0)

  const dietaryOptions: DietaryPreference[] = ['vegetarian', 'egg', 'chicken', 'meat', 'fish']
  
  const tagOptions: { value: FilterTag; label: string; icon: any; color: string }[] = [
    { value: 'popular', label: 'Popular', icon: Star, color: 'text-orange-600 bg-orange-50 border-orange-200' },
    { value: 'new', label: 'New Items', icon: Clock, color: 'text-green-600 bg-green-50 border-green-200' },
    { value: 'trending', label: 'Trending', icon: TrendUp, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { value: 'favorites', label: 'My Favorites', icon: Heart, color: 'text-red-600 bg-red-50 border-red-200' },
    { value: 'available-only', label: 'Available Only', icon: null, color: 'text-blue-600 bg-blue-50 border-blue-200' }
  ]

  return (
    <>
      <div className={cn("space-y-4", className)}>
        {/* Main search bar */}
        <div className="relative">
          <div className="relative flex items-center">
            <MagnifyingGlass 
              size={18} 
              className="absolute left-3 text-muted-foreground pointer-events-none" 
            />
            <Input
              type="text"
              placeholder="Search menu items, descriptions, categories..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-20 h-12 text-base rounded-xl border-2 focus:border-primary/50 transition-all duration-200"
              aria-label="Search menu items"
            />
            
            {/* Voice search and clear buttons */}
            <div className="absolute right-2 flex items-center gap-1">
              {recognition && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleVoiceSearch}
                  className={cn(
                    "h-8 w-8 p-0 rounded-lg transition-all duration-200",
                    isListening 
                      ? "bg-red-100 text-red-600 hover:bg-red-200 animate-pulse" 
                      : "hover:bg-muted"
                  )}
                  title={isListening ? 'Stop voice search' : 'Start voice search'}
                  disabled={!recognition}
                >
                  {isListening ? (
                    <MicrophoneSlash size={16} />
                  ) : (
                    <Microphone size={16} />
                  )}
                </Button>
              )}
              
              {searchQuery && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => onSearchChange('')}
                  className="h-8 w-8 p-0 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                  title="Clear search"
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          </div>
          
          {/* Listening indicator */}
          {isListening && (
            <div className="absolute -bottom-8 left-0 right-0 text-center">
              <span className="text-sm text-red-600 font-medium animate-pulse">
                🎤 Listening...
              </span>
            </div>
          )}
        </div>

        {/* Quick filter buttons and results */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAdvancedFilters(true)}
              className="h-9 px-3 gap-2 hover-lift transition-all duration-200"
            >
              <Funnel size={16} />
              Advanced Filters
              {activeFiltersCount > 0 && (
                <Badge variant="destructive" className="h-5 w-5 p-0 text-xs rounded-full">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
            
            {/* Quick sort buttons */}
            <div className="flex items-center gap-1 border rounded-lg p-1 bg-muted/30">
              <Button
                size="sm"
                variant={sortBy === 'name' ? 'default' : 'ghost'}
                onClick={() => {
                  setSortBy('name')
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                }}
                className="h-7 px-2 text-xs gap-1"
              >
                Name
                {sortBy === 'name' && (
                  sortOrder === 'asc' ? <SortAscending size={12} /> : <SortDescending size={12} />
                )}
              </Button>
              <Button
                size="sm"
                variant={sortBy.includes('price') ? 'default' : 'ghost'}
                onClick={() => {
                  setSortBy(sortBy === 'price-low' ? 'price-high' : 'price-low')
                }}
                className="h-7 px-2 text-xs"
              >
                {sortBy === 'price-high' ? 'Price ↑' : 'Price ↓'}
              </Button>
            </div>
          </div>
          
          {/* Results counter */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>
              Showing {filteredItemsCount} of {totalItems} items
            </span>
            {activeFiltersCount > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleClearAll}
                className="h-7 px-2 text-xs hover:text-destructive"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>

        {/* Active filters display */}
        {(searchQuery || selectedFilters.length > 0 || selectedCategory !== 'all' || selectedTags.length > 0) && (
          <div className="flex items-center gap-2 flex-wrap p-3 bg-muted/30 rounded-lg border border-border/50">
            <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
            
            {searchQuery && (
              <Badge variant="secondary" className="gap-2">
                Search: "{searchQuery}"
                <button 
                  onClick={() => onSearchChange('')}
                  className="hover:text-destructive"
                  aria-label="Remove search filter"
                >
                  <X size={12} />
                </button>
              </Badge>
            )}
            
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="gap-2">
                Category: {selectedCategory}
                <button 
                  onClick={() => onCategoryChange('all')}
                  className="hover:text-destructive"
                  aria-label="Remove category filter"
                >
                  <X size={12} />
                </button>
              </Badge>
            )}
            
            {selectedFilters.map(filter => (
              <Badge key={filter} variant="secondary" className="gap-2 capitalize">
                {filter}
                <button 
                  onClick={() => onFiltersChange(selectedFilters.filter(f => f !== filter))}
                  className="hover:text-destructive"
                  aria-label={`Remove ${filter} filter`}
                >
                  <X size={12} />
                </button>
              </Badge>
            ))}
            
            {selectedTags.map(tag => {
              const tagOption = tagOptions.find(t => t.value === tag)
              return (
                <Badge key={tag} variant="secondary" className="gap-2">
                  {tagOption?.label}
                  <button 
                    onClick={() => handleTagToggle(tag)}
                    className="hover:text-destructive"
                    aria-label={`Remove ${tagOption?.label} filter`}
                  >
                    <X size={12} />
                  </button>
                </Badge>
              )
            })}
          </div>
        )}
      </div>

      {/* Advanced Filters Dialog */}
      <Dialog open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
        <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Funnel className="text-primary" size={20} />
              Advanced Search & Filters
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Category Filter */}
            <div>
              <h4 className="font-medium mb-3">Categories</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    size="sm"
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    onClick={() => onCategoryChange(category)}
                    className="justify-start capitalize text-sm hover-lift"
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </Button>
                ))}
              </div>
            </div>
            
            <Separator />
            
            {/* Dietary Preferences */}
            <div>
              <h4 className="font-medium mb-3">Dietary Preferences</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {dietaryOptions.map(option => (
                  <Button
                    key={option}
                    size="sm"
                    variant={selectedFilters.includes(option) ? 'default' : 'outline'}
                    onClick={() => {
                      if (selectedFilters.includes(option)) {
                        onFiltersChange(selectedFilters.filter(f => f !== option))
                      } else {
                        onFiltersChange([...selectedFilters, option])
                      }
                    }}
                    className="justify-start capitalize text-sm hover-lift"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
            
            <Separator />
            
            {/* Special Tags */}
            <div>
              <h4 className="font-medium mb-3">Special Categories</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {tagOptions.map(option => {
                  const Icon = option.icon
                  return (
                    <Button
                      key={option.value}
                      size="sm"
                      variant={selectedTags.includes(option.value) ? 'default' : 'outline'}
                      onClick={() => handleTagToggle(option.value)}
                      className={cn(
                        "justify-start text-sm gap-2 hover-lift transition-all duration-200",
                        selectedTags.includes(option.value) ? '' : option.color
                      )}
                    >
                      {Icon && <Icon size={16} />}
                      {option.label}
                    </Button>
                  )
                })}
              </div>
            </div>
            
            <Separator />
            
            {/* Sort Options */}
            <div>
              <h4 className="font-medium mb-3">Sort By</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant={sortBy === 'name' ? 'default' : 'outline'}
                  onClick={() => setSortBy('name')}
                  className="justify-start text-sm hover-lift"
                >
                  Name
                </Button>
                <Button
                  size="sm"
                  variant={sortBy === 'price-low' ? 'default' : 'outline'}
                  onClick={() => setSortBy('price-low')}
                  className="justify-start text-sm hover-lift"
                >
                  Price: Low to High
                </Button>
                <Button
                  size="sm"
                  variant={sortBy === 'price-high' ? 'default' : 'outline'}
                  onClick={() => setSortBy('price-high')}
                  className="justify-start text-sm hover-lift"
                >
                  Price: High to Low
                </Button>
                <Button
                  size="sm"
                  variant={sortBy === 'category' ? 'default' : 'outline'}
                  onClick={() => setSortBy('category')}
                  className="justify-start text-sm hover-lift"
                >
                  Category
                </Button>
              </div>
            </div>
            
            <Separator />
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <Button
                onClick={() => setShowAdvancedFilters(false)}
                className="flex-1 hover-lift"
              >
                Apply Filters
              </Button>
              <Button
                variant="outline"
                onClick={handleClearAll}
                className="flex-1 hover-lift"
              >
                Clear All
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Add types for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}