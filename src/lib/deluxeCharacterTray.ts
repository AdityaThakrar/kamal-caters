import type { CartLine } from '../types/menu'

/** Menu item id for "Deluxe Sandwiches w/ Character" — includes salad + cookie choices. */
export const DELUXE_CHARACTER_TRAY_ITEM_ID = 'tray-deluxe-sandwiches-character'

export const DELUXE_CATERING_SALADS = [
  {
    value: 'Catering House Salad (Most Popular)',
    label: 'Catering House Salad (Most Popular)',
    subtext:
      'A large shared bowl of garden salad mix with cherry tomatoes, cucumber, red bell pepper, clover sprouts, croutons and balsamic vinaigrette.',
  },
  {
    value: 'Catering Caesar Salad',
    label: 'Catering Caesar Salad',
    subtext:
      'A large shared bowl of fresh romaine lettuce tossed with parmesan cheese, croutons, and Caesar dressing.',
  },
  {
    value: 'Catering Baja Fiesta Salad',
    label: 'Catering Baja Fiesta Salad',
    subtext:
      'A large shared bowl of chicken, romaine, baja bean salad, cheddar, avocado, red bell pepper, cherry tomatoes, with jalapeño ranch dressing and tri-color tortilla strips.',
  },
  {
    value: 'Catering Chicken Gorgonzola Salad',
    label: 'Catering Chicken Gorgonzola Salad',
    subtext:
      'A large shared bowl of chicken, garden salad mix, Gorgonzola, Craisins®, honey maple walnuts, blueberry pomegranate vinaigrette.',
  },
  {
    value: 'Catering Mandarin Tree Salad',
    label: 'Catering Mandarin Tree Salad',
    subtext:
      'A large shared bowl of chicken, romaine, red bell pepper, Mandarin oranges, cucumber, wonton strips, sesame dressing.',
  },
] as const

export const DELUXE_CATERING_COOKIES = [
  {
    value: '50/50 Assortment (Most Popular)',
    label: '50/50 Assortment (Most Popular)',
    subtext:
      'Half Sweet Street Chocolate Chunk Manifesto Cookies, Half Salted Caramel Manifesto Cookies.',
  },
  {
    value: 'All Sweet Street Chocolate Chunk Manifesto Cookies',
    label: 'All Sweet Street Chocolate Chunk Manifesto Cookies',
  },
  {
    value: 'All Sweet Street Salted Caramel Manifesto Cookies',
    label: 'All Sweet Street Salted Caramel Manifesto Cookies',
  },
] as const

export type DeluxeCateringSaladValue = (typeof DELUXE_CATERING_SALADS)[number]['value']
export type DeluxeCateringCookiesValue = (typeof DELUXE_CATERING_COOKIES)[number]['value']

export function defaultDeluxeCateringSalad(): DeluxeCateringSaladValue {
  return DELUXE_CATERING_SALADS[0]!.value
}

export function defaultDeluxeCateringCookies(): DeluxeCateringCookiesValue {
  return DELUXE_CATERING_COOKIES[0]!.value
}

/** Strip a trailing " (…)" segment for compact cart titles (e.g. "(Most Popular)", "(Ham & Turkey)"). */
export function stripTrailingParenthetical(s: string): string {
  return s.replace(/\s*\([^)]*\)\s*$/, '').trim()
}

export function isDeluxeTrayCompositeCartTitle(line: CartLine): boolean {
  return (
    line.menuItemId === DELUXE_CHARACTER_TRAY_ITEM_ID &&
    Boolean(line.trayPackage?.selectedSalad && line.trayPackage?.selectedCookies)
  )
}

/**
 * One-line cart / headcount title for deluxe character tray, e.g.
 * `2× Deluxe Sandwiches w/ Character (All R.E.O. Speedwagon, Catering House Salad, 50/50 Assortment)`.
 */
export function buildDeluxeTrayCartSummaryLabel(line: CartLine, itemName: string): string | null {
  if (!isDeluxeTrayCompositeCartTitle(line) || !line.trayPackage) return null
  const { trayConfiguration, selectedSalad, selectedCookies } = line.trayPackage
  const sandwich = stripTrailingParenthetical(trayConfiguration)
  const salad = stripTrailingParenthetical(selectedSalad!)
  const cookies = stripTrailingParenthetical(selectedCookies!)
  return `${line.qty}× ${itemName} (${sandwich}, ${salad}, ${cookies})`
}
