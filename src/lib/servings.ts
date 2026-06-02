/**
 * All headcount / tray math should go through this module so `serves_count`
 * stays easy to reason about when you edit menu rows in `menuItems.ts`.
 */

import type { CartLine } from '../types/menu'
import type { MenuItem } from '../types/menu'

/** When total cart servings exceed headcount × this ratio, we treat it as “heavy” over-ordering. */
export const HEAVY_SERVINGS_MULTIPLIER = 1.35

export function lineServings(qty: number, servesCount: number): number {
  return Math.max(0, qty) * Math.max(0, servesCount)
}

export function totalCartServings(
  lines: CartLine[],
  getItem: (id: string) => MenuItem | undefined,
): number {
  return lines.reduce((sum, line) => {
    const item = getItem(line.menuItemId)
    if (!item) return sum
    return sum + lineServings(line.qty, item.serves_count)
  }, 0)
}

export function lineExceedsHeadcount(
  qty: number,
  servesCount: number,
  headcount: number,
): boolean {
  if (headcount <= 0) return false
  return lineServings(qty, servesCount) > headcount
}

export function totalHeavilyExceedsHeadcount(
  totalServings: number,
  headcount: number,
): boolean {
  if (headcount <= 0) return false
  return totalServings > headcount * HEAVY_SERVINGS_MULTIPLIER
}
