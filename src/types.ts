export type MenuType = 'dinein-non-ac' | 'dinein-ac' | 'takeaway'

export type DietaryPreference = 'vegetarian' | 'vegan' | 'egg' | 'chicken' | 'meat' | 'fish'

export interface MenuItem {
  id: string
  name: string
  description: string
  prices: {
    'dinein-non-ac': number
    'dinein-ac': number
    'takeaway': number
  }
  category: string
  available: boolean
  image?: string
  dietary: DietaryPreference[]
}

export interface MenuPricing {
  'dinein-non-ac': number
  'dinein-ac': number
  'takeaway': number
}