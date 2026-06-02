import { create } from 'zustand'

import { storeById } from '../data/storeLocations'
import type { StoreId } from '../data/storeLocations'
import { getMenuItemById } from '../data/menuItems'
import { cartLineFoodSubtotal } from '../lib/boxedLunch'
import { lineServings, totalCartServings } from '../lib/servings'
import { isBookingSelectionValid, getCurrentDateTime } from '../lib/datetime'
import { isDeliveryAddressValid, isPickupZipValid } from '../lib/addressValidation'
import { DELIVERY_FEE_USD, taxAmountFromTaxableSubtotal, taxableSubtotal } from '../lib/tax'
import type { CartLine, ExcludableIngredient } from '../types/menu'

export type OrderType = 'delivery' | 'pickup'

type TipPreset = 5 | 10 | 15 | 20 | 'other'

interface CateringState {
  orderType: OrderType | null
  /** Pickup: service-area / customer ZIP (5 digits). */
  zipCode: string
  deliveryLine1: string
  deliveryCity: string
  deliveryState: string
  deliveryZip: string
  selectedStoreId: StoreId | null
  /** Extra routing copy (distances, tie-break). */
  storeRoutingSummary: string
  selectedStoreLabel: string
  selectedDateKey: string | null
  selectedTimeWindow: string | null
  headcount: number | null
  cart: CartLine[]
  tipPreset: TipPreset
  tipOtherPercent: number
  paymentEmail: string

  setOrderType: (t: OrderType | null) => void
  setZipCode: (zip: string) => void
  setDeliveryFields: (patch: Partial<{
    deliveryLine1: string
    deliveryCity: string
    deliveryState: string
    deliveryZip: string
  }>) => void
  assignStoreFromRouting: (storeId: StoreId, routingSummary: string) => void
  clearStoreAssignment: () => void
  setSelectedStoreLabel: (label: string) => void
  setSelectedDateKey: (d: string | null) => void
  setSelectedTimeWindow: (w: string | null) => void
  setHeadcount: (n: number | null) => void
  addCartLine: (line: Omit<CartLine, 'lineId'> & { lineId?: string }) => void
  updateLineQty: (lineId: string, qty: number) => void
  removeLine: (lineId: string) => void
  clearCart: () => void
  setTipPreset: (p: TipPreset) => void
  setTipOtherPercent: (n: number) => void
  setPaymentEmail: (email: string) => void

  onboardingValid: () => boolean
  subtotal: () => number
  taxableSubtotal: () => number
  taxAmount: () => number
  deliveryFee: () => number
  tipAmount: () => number
  total: () => number
}

const initialStoreLabel = 'Your kitchen will be assigned from your ZIP or delivery address.'

export const useCateringStore = create<CateringState>((set, get) => ({
  orderType: null,
  zipCode: '',
  deliveryLine1: '',
  deliveryCity: '',
  deliveryState: 'CA',
  deliveryZip: '',
  selectedStoreId: null,
  storeRoutingSummary: '',
  selectedStoreLabel: initialStoreLabel,
  selectedDateKey: null,
  selectedTimeWindow: null,
  headcount: null,
  cart: [],
  tipPreset: 15,
  tipOtherPercent: 18,
  paymentEmail: 'office.manager@company.com',

  setOrderType: (orderType) =>
    set({
      orderType,
      zipCode: '',
      deliveryLine1: '',
      deliveryCity: '',
      deliveryState: 'CA',
      deliveryZip: '',
      selectedStoreId: null,
      storeRoutingSummary: '',
      selectedStoreLabel: initialStoreLabel,
    }),

  setZipCode: (zipCode) =>
    set({
      zipCode: zipCode.replace(/\D/g, '').slice(0, 5),
      selectedStoreId: null,
      storeRoutingSummary: '',
      selectedStoreLabel: initialStoreLabel,
    }),

  setDeliveryFields: (patch) =>
    set((s) => ({
      deliveryLine1: patch.deliveryLine1 ?? s.deliveryLine1,
      deliveryCity: patch.deliveryCity ?? s.deliveryCity,
      deliveryState: patch.deliveryState ?? s.deliveryState,
      deliveryZip:
        patch.deliveryZip !== undefined
          ? patch.deliveryZip.replace(/\D/g, '').slice(0, 5)
          : s.deliveryZip,
      selectedStoreId: null,
      storeRoutingSummary: '',
      selectedStoreLabel: initialStoreLabel,
    })),

  assignStoreFromRouting: (storeId, routingSummary) => {
    const loc = storeById(storeId)
    set({
      selectedStoreId: storeId,
      storeRoutingSummary: routingSummary,
      selectedStoreLabel: `Fulfilling from: ${loc.title} — ${loc.address}`,
    })
  },

  clearStoreAssignment: () =>
    set({
      selectedStoreId: null,
      storeRoutingSummary: '',
      selectedStoreLabel: initialStoreLabel,
    }),

  setSelectedStoreLabel: (selectedStoreLabel) => set({ selectedStoreLabel }),
  setSelectedDateKey: (selectedDateKey) => set({ selectedDateKey }),
  setSelectedTimeWindow: (selectedTimeWindow) => set({ selectedTimeWindow }),
  setHeadcount: (headcount) => set({ headcount }),
  addCartLine: (line) =>
    set((s) => ({
      cart: [
        ...s.cart,
        {
          ...line,
          lineId: line.lineId ?? crypto.randomUUID(),
        },
      ],
    })),
  updateLineQty: (lineId, qty) =>
    set((s) => ({
      cart: s.cart.map((l) =>
        l.lineId === lineId ? { ...l, qty: Math.max(1, qty) } : l,
      ),
    })),
  removeLine: (lineId) =>
    set((s) => ({
      cart: s.cart.filter((l) => l.lineId !== lineId),
    })),
  clearCart: () => set({ cart: [] }),
  setTipPreset: (tipPreset) => set({ tipPreset }),
  setTipOtherPercent: (tipOtherPercent) => set({ tipOtherPercent }),
  setPaymentEmail: (paymentEmail) => set({ paymentEmail }),

  onboardingValid: () => {
    const s = get()
    const dinersOk = typeof s.headcount === 'number' && s.headcount > 0
    if (!s.orderType || !s.selectedStoreId || !s.selectedDateKey || !s.selectedTimeWindow || !dinersOk) {
      return false
    }
    if (!isBookingSelectionValid(s.selectedDateKey, s.selectedTimeWindow, getCurrentDateTime())) {
      return false
    }
    if (s.orderType === 'pickup') {
      return isPickupZipValid(s.zipCode) && Boolean(s.selectedStoreId)
    }
    return isDeliveryAddressValid({
      deliveryLine1: s.deliveryLine1,
      deliveryCity: s.deliveryCity,
      deliveryState: s.deliveryState,
      deliveryZip: s.deliveryZip,
    })
  },

  subtotal: () => {
    return get().cart.reduce(
      (sum, line) => sum + cartLineFoodSubtotal(line, getMenuItemById),
      0,
    )
  },

  taxableSubtotal: () => taxableSubtotal(get().cart, getMenuItemById),

  taxAmount: () => taxAmountFromTaxableSubtotal(get().taxableSubtotal()),

  deliveryFee: () => (get().orderType === 'delivery' ? DELIVERY_FEE_USD : 0),

  tipAmount: () => {
    const sub = get().subtotal()
    const preset = get().tipPreset
    const pct =
      preset === 'other'
        ? Math.max(0, get().tipOtherPercent)
        : preset
    return sub * (pct / 100)
  },

  total: () =>
    get().subtotal() + get().taxAmount() + get().tipAmount() + get().deliveryFee(),
}))

export const EXCLUDABLE_INGREDIENTS: ExcludableIngredient[] = [
  'Tomato',
  'Onion',
  'Sauce',
  'Lettuce',
  'Sprouts',
  'Avocado',
]

export function cartLineServings(line: CartLine): number {
  const item = getMenuItemById(line.menuItemId)
  if (!item) return 0
  return lineServings(line.qty, item.serves_count)
}

export function cartTotalServings(lines: CartLine[]): number {
  return totalCartServings(lines, getMenuItemById)
}
