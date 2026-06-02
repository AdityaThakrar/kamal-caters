export type DietaryTag = 'GF' | 'VG' | 'V'

export type PackagingType = 'Individual' | 'Tray'

export type ExcludableIngredient =
  | 'Tomato'
  | 'Onion'
  | 'Sauce'
  | 'Lettuce'
  | 'Sprouts'
  | 'Avocado'

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  dietary_tags: DietaryTag[]
  packaging_type: PackagingType
  /** Portions covered per unit ordered — adjust freely in `src/data/menuItems.ts`. */
  serves_count: number
  /**
   * CA retail: tax only on applicable items (e.g. carbonated beverages, hot food).
   * Cold food to-go / still water typically exempt — see `src/lib/tax.ts`.
   */
  is_taxable: boolean
  most_ordered?: boolean
  /**
   * Square photo for cards + modal. Prefer `/images/menu/*.avif` (see `public/images/menu/README.md`).
   */
  imageSrc?: string
}

export interface CartLine {
  lineId: string
  menuItemId: string
  qty: number
  excluded: Partial<Record<ExcludableIngredient, boolean>>
  nameOnBox?: string
  /** Kitchen notes for simple individual lines (e.g. Individual Salads). */
  specialInstructions?: string
  /**
   * When set, this line is one scalable boxed-lunch package: `qty` = guests.
   * Subtotal uses base per-person + dessert upcharge (see `src/lib/boxedLunch.ts`).
   */
  boxedLunch?: {
    chips: string
    dessertSummary: string
    dessertUpchargePerPerson: number
    specialInstructions?: string
    /** "Gluten Free (Custom)" portal — sandwich name from standard boxed lunch menu. */
    sandwichChoice?: string
  }
  /**
   * Catering / sandwich tray lines: bulk config + notes (no per-ingredient holds).
   * Batch / box naming uses `nameOnBox` (same field as other lines).
   */
  trayPackage?: {
    trayConfiguration: string
    /** "Deluxe Sandwiches w/ Character" only — catering-sized salad choice. */
    selectedSalad?: string
    /** "Deluxe Sandwiches w/ Character" only — one-dozen cookie choice. */
    selectedCookies?: string
    specialInstructions?: string
  }
}
