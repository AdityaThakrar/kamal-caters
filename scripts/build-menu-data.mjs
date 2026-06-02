import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const menuItemsPath = path.join(root, 'src/data/menuItems.ts')
const outPath = path.join(root, 'src/data/menuData.ts')

const sRaw = fs.readFileSync(menuItemsPath, 'utf8')
const s = sRaw.replace(/\r\n/g, '\n')
const start = s.indexOf('export const MENU_ITEMS: MenuItem[] = [')
const arrayOpen = s.indexOf('= [', start)
const braceStart = arrayOpen >= 0 ? arrayOpen + 2 : s.indexOf('[', start)
const fnIdx = s.indexOf('export function getMenuItemById')
const closeBracket = s.lastIndexOf(']', fnIdx)
if (start < 0 || arrayOpen < 0 || fnIdx < 0 || closeBracket < braceStart) {
  throw new Error('Could not find MENU_ITEMS bounds')
}
let arr = s.slice(braceStart, closeBracket + 1)
arr = arr
  .replace(/\bname:/g, 'title:')
  .replace(/\bmost_ordered:\s*true\b/g, 'isPopular: true')

arr = arr.replace(/(\bis_taxable:\s*(?:true|false)\s*,?\s*\n)(?!\s*imagePath)(\s*isPopular)/g, '$1    imagePath: \'\',\n$2')
arr = arr.replace(/(\bis_taxable:\s*(?:true|false)\s*,?\s*\n)(?!\s*imagePath)(\s*\})/g, '$1    imagePath: \'\',\n$2')
arr = arr.replace(/(imagePath: ''\s*,\s*\n)\s*imagePath: ''\s*,\s*\n/g, '$1')

const header = `import type { DietaryTag, PackagingType } from '../types/menu'

/**
 * Central menu records: presentation (title, imagePath, isPopular) plus fields
 * required for cart, tax, and modals. Mapped to \`MenuItem\` in \`menuItems.ts\`.
 */
export interface MenuDataItem {
  id: string
  category: string
  title: string
  description: string
  price: number
  /** Public URL under \`public/\`, e.g. \`/images/menu/boxed-italian-job.avif\`. Use "" until the asset exists. */
  imagePath: string
  /** Renders the "Most ordered" pill on menu cards when true. */
  isPopular?: boolean
  dietary_tags: DietaryTag[]
  packaging_type: PackagingType
  serves_count: number
  is_taxable: boolean
}

`

const cats = `/** Category string for single-portion salads (modal: notes only, no ingredient checkboxes). */
export const INDIVIDUAL_SALADS_CATEGORY = 'Individual Salads' as const

/** Category string for large catering salad bowls (modal: qty + label + notes only). */
export const CATERING_SALADS_SERVES_12_CATEGORY = 'Catering Salads (Serves 12)' as const

/** Category string for sides (modal: quantity only). */
export const SIDES_CATEGORY = 'Sides' as const

/** Category string for desserts (modal: quantity only). */
export const DESSERTS_CATEGORY = 'Desserts' as const

/** Category string for beverages (modal: quantity only). */
export const BEVERAGES_CATEGORY = 'Beverages' as const

/** Sidebar / anchor order (must match \`category\` on items you want grouped). */
export const MENU_NAV_CATEGORIES = [
  'Boxed Lunches',
  'Catering Packages & Sandwich Trays',
  INDIVIDUAL_SALADS_CATEGORY,
  CATERING_SALADS_SERVES_12_CATEGORY,
  SIDES_CATEGORY,
  DESSERTS_CATEGORY,
  BEVERAGES_CATEGORY,
] as const

`

const body = `${cats}export const MENU_DATA_ITEMS: MenuDataItem[] = ${arr.trim()}\n\n/** Alias for consumers that prefer the prompt naming (\`menuItems\`). */
export const menuItems = MENU_DATA_ITEMS
`

fs.writeFileSync(outPath, header + body, 'utf8')
console.log('Wrote', outPath)
