import { describe, it, expect } from 'vitest'
import { validateOrder } from './orderLogic'

describe('validateOrder', () => {
  it('accepts a valid order', () => {
    const result = validateOrder({ item: 'Turkey Sandwich', quantity: 2 })
    expect(result.valid).toBe(true)
  })

  it('rejects an order with no item', () => {
    const result = validateOrder({ quantity: 2 })
    expect(result.valid).toBe(false)
  })

  it('rejects a quantity less than 1', () => {
    const result = validateOrder({ item: 'Salad', quantity: 0 })
    expect(result.valid).toBe(false)
  })
})
