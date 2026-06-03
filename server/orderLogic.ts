export function validateOrder(order: any): { valid: boolean; error?: string } {
  if (!order || !order.item) {
    return { valid: false, error: 'Order must include an item' }
  }
  if (order.quantity !== undefined && order.quantity < 1) {
    return { valid: false, error: 'Quantity must be at least 1' }
  }
  return { valid: true }
}
