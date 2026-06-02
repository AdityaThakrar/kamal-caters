import { SIDES_CATEGORY, DESSERTS_CATEGORY, BEVERAGES_CATEGORY } from '../data/menuItems'
import type { MenuItem } from '../types/menu'

/**
 * Show "Serves n" on menu cards. `serves_count` stays on the item for headcount / cart math.
 * Hidden for: all chips, desserts except Assorted Sweets & Carrot Cake, all beverages.
 */
export function showServesCountOnMenuCard(item: MenuItem): boolean {
  if (item.category === BEVERAGES_CATEGORY) return false

  if (item.category === SIDES_CATEGORY && item.name.endsWith('Chips')) return false

  if (item.category === DESSERTS_CATEGORY) {
    return item.id === 'dessert-assorted-sweets' || item.id === 'dessert-carrot-cake'
  }

  return true
}
