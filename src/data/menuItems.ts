import type { MenuItem } from '../types/menu'

import { MENU_DATA_ITEMS, type MenuDataItem } from './menuData'

export {
  BEVERAGES_CATEGORY,
  CATERING_SALADS_SERVES_12_CATEGORY,
  DESSERTS_CATEGORY,
  INDIVIDUAL_SALADS_CATEGORY,
  MENU_NAV_CATEGORIES,
  SIDES_CATEGORY,
} from './menuData'

/** Maps central menu records into the runtime `MenuItem` shape (cart, modals, tax). */
export function menuDataItemToMenuItem(row: MenuDataItem): MenuItem {
  const trimmed = row.imagePath.trim()
  return {
    id: row.id,
    name: row.title,
    description: row.description,
    price: row.price,
    category: row.category,
    dietary_tags: row.dietary_tags,
    packaging_type: row.packaging_type,
    serves_count: row.serves_count,
    is_taxable: row.is_taxable,
    most_ordered: row.isPopular,
    imageSrc: trimmed ? trimmed : undefined,
  }
}

export const MENU_ITEMS: MenuItem[] = MENU_DATA_ITEMS.map(menuDataItemToMenuItem)

export function getMenuItemById(id: string): MenuItem | undefined {
  return MENU_ITEMS.find((i) => i.id === id)
}
