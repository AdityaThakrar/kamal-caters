import { BOXED_GF_CUSTOM_ITEM_ID } from '../data/menuData'
import type { CartLine, MenuItem } from '../types/menu'

export { BOXED_GF_CUSTOM_ITEM_ID }

/** ezCater-style boxed lunch per-person base (modal + cart math). */
export const BOXED_LUNCH_BASE_PER_PERSON = 16.99

/** Cart / kitchen copy for the GF custom portal (locked sides). */
export const BOXED_GF_LOCKED_CHIPS_CART = "Lay's Potato Chips (GF)"
export const BOXED_GF_LOCKED_DESSERT_CART = 'Chewy Marshmallow Manifesto Bar (GF)'

export const PERUVIAN_BROWNIE_UPCHARGE_PER_PERSON = 0.75

export const BOXED_CHIP_OPTIONS = [
  'BBQ Chips (Most Popular)',
  'Jalapeno Chips',
  'Potato Chips',
  'Salt & Vinegar Chips',
  'Sun Chips',
] as const

export type BoxedChipOption = (typeof BOXED_CHIP_OPTIONS)[number]

export interface BoxedDessertChoice {
  id: string
  label: string
  /** Shown inside cart parentheses, e.g. "Chocolate Chunk Cookie". */
  cartSummary: string
  upchargePerPerson: number
}

export const BOXED_DESSERT_CHOICES: BoxedDessertChoice[] = [
  {
    id: 'mp_chocolate_chunk',
    label: 'Sweet Street Chocolate Chunk Manifesto Cookie (Most Popular)',
    cartSummary: 'Chocolate Chunk Manifesto Cookie',
    upchargePerPerson: 0,
  },
  {
    id: 'salted_caramel_manifesto',
    label: 'Sweet Street Salted Caramel Manifesto Cookie',
    cartSummary: 'Salted Caramel Manifesto Cookie',
    upchargePerPerson: 0,
  },
  {
    id: 'marshmallow_manifesto_bar',
    label: 'Marshmallow Manifesto Bar',
    cartSummary: 'Marshmallow Manifesto Bar',
    upchargePerPerson: 0,
  },
  {
    id: 'peruvian_chocolate_brownie',
    label: 'Peruvian Chocolate Manifesto Brownie (+$0.75)',
    cartSummary: 'Peruvian Chocolate Manifesto Brownie',
    upchargePerPerson: PERUVIAN_BROWNIE_UPCHARGE_PER_PERSON,
  },
]

export function defaultBoxedDessertId(): string {
  return BOXED_DESSERT_CHOICES[0]!.id
}

export function boxedDessertById(id: string): BoxedDessertChoice | undefined {
  return BOXED_DESSERT_CHOICES.find((d) => d.id === id)
}

export function isBoxedLunchLine(line: CartLine): boolean {
  return Boolean(line.boxedLunch)
}

/** Primary label for cart / checkout summaries. */
export function boxedCartPrimaryLabel(line: CartLine, itemName: string): string {
  if (!line.boxedLunch) return itemName
  const { chips, dessertSummary, sandwichChoice } = line.boxedLunch
  if (sandwichChoice) {
    return `${line.qty}× ${itemName} — ${sandwichChoice} on GF bread (${chips}; ${dessertSummary})`
  }
  return `${line.qty}× ${itemName} (${chips}, ${dessertSummary})`
}

/** Food subtotal for one cart line (boxed uses package math; others menu price × qty). */
export function cartLineFoodSubtotal(
  line: CartLine,
  getItem: (id: string) => MenuItem | undefined,
): number {
  const item = getItem(line.menuItemId)
  if (!item) return 0
  if (line.boxedLunch) {
    if (line.menuItemId === BOXED_GF_CUSTOM_ITEM_ID) {
      return Math.round(item.price * line.qty * 100) / 100
    }
    const unit = BOXED_LUNCH_BASE_PER_PERSON + line.boxedLunch.dessertUpchargePerPerson
    return Math.round(unit * line.qty * 100) / 100
  }
  return Math.round(item.price * line.qty * 100) / 100
}

export function boxedLunchModalTotal(quantity: number, dessertUpchargePerPerson: number): number {
  const unit = BOXED_LUNCH_BASE_PER_PERSON + dessertUpchargePerPerson
  return Math.round(unit * quantity * 100) / 100
}
