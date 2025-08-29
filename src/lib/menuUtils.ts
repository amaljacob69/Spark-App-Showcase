import { MenuItem, MenuType } from '@/types'

/**
 * Get the price of a menu item for a specific menu type
 */
export const getItemPrice = (item: MenuItem, menuType: MenuType): number => {
  if (!item?.prices || typeof item.prices[menuType] !== 'number' || isNaN(item.prices[menuType])) {
    return 0
  }
  return item.prices[menuType]
}