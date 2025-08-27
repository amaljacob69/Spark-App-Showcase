import { Badge } from './ui/badge'
import { Leaf, Drop, Fire, Heart, Prohibit } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export type DietaryTag = 
  | 'vegetarian' 
  | 'vegan' 
  | 'gluten-free' 
  | 'dairy-free' 
  | 'nut-free'
  | 'spicy' 
  | 'low-calorie'
  | 'heart-healthy'
  | 'keto'

export type AllergenType = 
  | 'nuts' 
  | 'dairy' 
  | 'eggs' 
  | 'soy' 
  | 'wheat' 
  | 'shellfish' 
  | 'fish'

export interface NutritionalInfo {
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  fiber?: number
  sodium?: number
}

export interface DietaryInfo {
  tags: DietaryTag[]
  allergens: AllergenType[]
  nutritional?: NutritionalInfo
}

const tagIcons: Record<DietaryTag, any> = {
  'vegetarian': Leaf,
  'vegan': Leaf,
  'gluten-free': Prohibit,
  'dairy-free': Drop,
  'nut-free': Prohibit,
  'spicy': Fire,
  'low-calorie': Heart,
  'heart-healthy': Heart,
  'keto': Heart,
}

const tagColors: Record<DietaryTag, string> = {
  'vegetarian': 'bg-green-100 text-green-800 border-green-200',
  'vegan': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'gluten-free': 'bg-amber-100 text-amber-800 border-amber-200',
  'dairy-free': 'bg-blue-100 text-blue-800 border-blue-200',
  'nut-free': 'bg-orange-100 text-orange-800 border-orange-200',
  'spicy': 'bg-red-100 text-red-800 border-red-200',
  'low-calorie': 'bg-purple-100 text-purple-800 border-purple-200',
  'heart-healthy': 'bg-pink-100 text-pink-800 border-pink-200',
  'keto': 'bg-indigo-100 text-indigo-800 border-indigo-200',
}

interface DietaryTagsProps {
  dietary: DietaryInfo
  showNutrition?: boolean
  compact?: boolean
  className?: string
}

export function DietaryTags({ dietary, showNutrition = false, compact = false, className }: DietaryTagsProps) {
  if (dietary.tags.length === 0 && dietary.allergens.length === 0 && !showNutrition) {
    return null
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Dietary Tags */}
      {dietary.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {dietary.tags.map((tag) => {
            const Icon = tagIcons[tag]
            return (
              <Badge 
                key={tag} 
                variant="outline" 
                className={cn(
                  "text-xs border font-medium transition-all duration-200 hover:scale-105",
                  tagColors[tag],
                  compact && "px-1.5 py-0.5 text-[10px]"
                )}
              >
                <Icon size={compact ? 10 : 12} className="mr-1" />
                {tag.replace('-', ' ')}
              </Badge>
            )
          })}
        </div>
      )}

      {/* Allergen Warnings */}
      {dietary.allergens.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs border-red-200 bg-red-50 text-red-700 font-medium">
            ⚠️ Contains: {dietary.allergens.join(', ')}
          </Badge>
        </div>
      )}

      {/* Nutritional Information */}
      {showNutrition && dietary.nutritional && (
        <div className="bg-muted/50 rounded-md p-2 text-xs space-y-1">
          <div className="font-medium text-muted-foreground mb-1">Nutrition (per serving)</div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {dietary.nutritional.calories && (
              <div>Calories: <span className="font-medium">{dietary.nutritional.calories}</span></div>
            )}
            {dietary.nutritional.protein && (
              <div>Protein: <span className="font-medium">{dietary.nutritional.protein}g</span></div>
            )}
            {dietary.nutritional.carbs && (
              <div>Carbs: <span className="font-medium">{dietary.nutritional.carbs}g</span></div>
            )}
            {dietary.nutritional.fat && (
              <div>Fat: <span className="font-medium">{dietary.nutritional.fat}g</span></div>
            )}
            {dietary.nutritional.fiber && (
              <div>Fiber: <span className="font-medium">{dietary.nutritional.fiber}g</span></div>
            )}
            {dietary.nutritional.sodium && (
              <div>Sodium: <span className="font-medium">{dietary.nutritional.sodium}mg</span></div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Utility function to filter items by dietary requirements
export function matchesDietaryFilter(
  dietary: DietaryInfo, 
  filters: { 
    tags?: DietaryTag[], 
    excludeAllergens?: AllergenType[] 
  }
): boolean {
  // Check if item has required tags
  if (filters.tags && filters.tags.length > 0) {
    const hasAllTags = filters.tags.every(tag => dietary.tags.includes(tag))
    if (!hasAllTags) return false
  }

  // Check if item contains excluded allergens
  if (filters.excludeAllergens && filters.excludeAllergens.length > 0) {
    const hasExcludedAllergen = filters.excludeAllergens.some(allergen => 
      dietary.allergens.includes(allergen)
    )
    if (hasExcludedAllergen) return false
  }

  return true
}