import type { CartLine, MenuItem } from '../types/menu'

import { buildDeluxeTrayCartSummaryLabel } from './deluxeCharacterTray'

/** Sandwich tray configuration options (radio). `value` is persisted on the cart line. */
export const TRAY_SANDWICH_CONFIGURATIONS = [
  {
    value: "Erik's Assortment (Most Popular)",
    label: "Erik's Assortment (Most Popular)",
    subtext:
      "Includes a crowd-pleasing mix of Pilgrim's Progress, Pot Belly, R.E.O. Speedwagon, and Farmer's Market (Veggie).",
  },
  {
    value: "All Pilgrim's Progress (Turkey & Avocado)",
    label: "All Pilgrim's Progress (Turkey & Avocado)",
  },
  {
    value: 'All R.E.O. Speedwagon (Ham & Turkey)',
    label: 'All R.E.O. Speedwagon (Ham & Turkey)',
  },
  {
    value: "All Farmer's Market (Vegetarian)",
    label: "All Farmer's Market (Vegetarian)",
  },
  {
    value: 'All Italian Job (Italian Cold Cuts)',
    label: 'All Italian Job (Italian Cold Cuts)',
  },
  {
    value: 'All Dub Club (Turkey, Ham, Bacon)',
    label: 'All Dub Club (Turkey, Ham, Bacon)',
  },
  {
    value: 'All Chicken Pesto (Chicken & Pesto)',
    label: 'All Chicken Pesto (Chicken & Pesto)',
  },
  {
    value: 'All California Crunch (Turkey & Pastrami)',
    label: 'All California Crunch (Turkey & Pastrami)',
  },
] as const

export type TraySandwichConfigurationValue = (typeof TRAY_SANDWICH_CONFIGURATIONS)[number]['value']

export function defaultTraySandwichConfiguration(): TraySandwichConfigurationValue {
  return TRAY_SANDWICH_CONFIGURATIONS[0]!.value
}

export function trayModalLineTotal(item: MenuItem, quantity: number): number {
  return Math.round(item.price * quantity * 100) / 100
}

/** Title cell for checkout / headcount tables (non-boxed tray lines). */
export function trayCartSummaryLabel(line: CartLine, itemName: string): string {
  if (!line.trayPackage) return itemName
  const deluxeTitle = buildDeluxeTrayCartSummaryLabel(line, itemName)
  if (deluxeTitle) return deluxeTitle
  return `${line.qty}× ${itemName}`
}
