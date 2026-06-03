export interface Order {
  id: number
  item: string
  quantity?: number
}

export function validateOrder(order: Partial<Order>): { valid: boolean; error?: string } {
  if (!order || !order.item) {
    return { valid: false, error: 'Order must include an item' }
  }
  if (order.quantity !== undefined && order.quantity < 1) {
    return { valid: false, error: 'Quantity must be at least 1' }
  }
  return { valid: true }
}
