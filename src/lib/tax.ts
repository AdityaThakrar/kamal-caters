import { cartLineFoodSubtotal } from './boxedLunch'
import type { CartLine, MenuItem } from '../types/menu'

/** Combined state + local district — demo blended rate (e.g. 9.375%). */
export const TAX_RATE = 0.09375

/** Short hint for hover (detail opens on tap). */
export const TAX_LINE_HELP_TOOLTIP = 'Tap for which items are taxed (e.g. carbonated drinks).'

/** Full copy shown when the (? ) help control is opened. */
export const TAX_DISCLAIMER_DETAIL =
  'Sales tax applies only to taxable items in your cart. Taxable items include carbonated beverages (canned soda, sparkling water, and similar drinks) and other menu lines marked taxable, such as hot prepared food. Most cold food to-go and still bottled water are usually not taxed. Rates follow applicable California state and local law.'

/** Delivery fee in USD (set > 0 when you wire real pricing). */
export const DELIVERY_FEE_USD = 0

export function roundCurrency2(amount: number): number {
  return Math.round(amount * 100) / 100
}

/** Sum of (price × qty) for cart lines whose menu item is taxable. */
export function taxableSubtotal(
  lines: CartLine[],
  getItem: (id: string) => MenuItem | undefined,
): number {
  return lines.reduce((sum, line) => {
    const item = getItem(line.menuItemId)
    if (!item || !item.is_taxable) return sum
    return sum + cartLineFoodSubtotal(line, getItem)
  }, 0)
}

export function taxAmountFromTaxableSubtotal(taxable: number): number {
  return roundCurrency2(Math.max(0, taxable) * TAX_RATE)
}
