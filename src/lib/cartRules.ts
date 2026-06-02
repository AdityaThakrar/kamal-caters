/** Food & beverage subtotal (before tax, tip, delivery) must meet this for checkout. */
export const MINIMUM_ORDER_SUBTOTAL = 250.0

export function meetsOrderMinimum(subtotal: number): boolean {
  return subtotal >= MINIMUM_ORDER_SUBTOTAL
}

export function orderMinimumShortfall(subtotal: number): number {
  return Math.max(0, MINIMUM_ORDER_SUBTOTAL - subtotal)
}
