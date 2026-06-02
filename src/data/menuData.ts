import type { DietaryTag, PackagingType } from '../types/menu'

/**
 * Central menu records: presentation (title, imagePath, isPopular) plus fields
 * required for cart, tax, and modals. Mapped to `MenuItem` in `menuItems.ts`.
 */
export interface MenuDataItem {
  id: string
  category: string
  title: string
  description: string
  price: number
  /** Public URL under `public/`, e.g. `/images/menu/boxed-italian-job.avif`. Use "" until the asset exists. */
  imagePath: string
  /** Renders the "Most ordered" pill on menu cards when true. */
  isPopular?: boolean
  dietary_tags: DietaryTag[]
  packaging_type: PackagingType
  serves_count: number
  is_taxable: boolean
}

/** Specialty boxed lunch with custom GF modal (`BoxedLunchCustomizeModal`). */
export const BOXED_GF_CUSTOM_ITEM_ID = 'boxed-gf-custom' as const

/** Category string for single-portion salads (modal: notes only, no ingredient checkboxes). */
export const INDIVIDUAL_SALADS_CATEGORY = 'Individual Salads' as const

/** Category string for large catering salad bowls (modal: qty + label + notes only). */
export const CATERING_SALADS_SERVES_12_CATEGORY = 'Catering Salads (Serves 12)' as const

/** Category string for sides (modal: quantity only). */
export const SIDES_CATEGORY = 'Sides' as const

/** Category string for desserts (modal: quantity only). */
export const DESSERTS_CATEGORY = 'Desserts' as const

/** Category string for beverages (modal: quantity only). */
export const BEVERAGES_CATEGORY = 'Beverages' as const

/** Sidebar / anchor order (must match `category` on items you want grouped). */
export const MENU_NAV_CATEGORIES = [
  'Boxed Lunches',
  'Catering Packages & Sandwich Trays',
  INDIVIDUAL_SALADS_CATEGORY,
  CATERING_SALADS_SERVES_12_CATEGORY,
  SIDES_CATEGORY,
  DESSERTS_CATEGORY,
  BEVERAGES_CATEGORY,
] as const

export const MENU_DATA_ITEMS: MenuDataItem[] = [
  /* ----- Boxed Lunches ($16.99 tier) — serves_count: 1 each ----- */
  {
    id: 'boxed-pilgrims-progress',
    title: "Pilgrim's Progress",
    description: 'Tender turkey breast, avocado slices, tomato, onions, clover sprouts, Erik’s Secret Goo® on hearty 9 grain bread.',
    price: 16.99,
    category: 'Boxed Lunches',
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/pilgrim-progress.avif', // This is the magic link
    isPopular: true,
  },
  {
    id: 'boxed-dub-club',
    title: 'Dub Club',
    description: 'Tender turkey breast, smoked ham, hickory smoked bacon, cheddar cheese, avocado slices, tomato, onions, clover sprouts, Erik’s Secret Goo® on sourdough bread.',
    price: 16.99,
    category: 'Boxed Lunches',
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/dub-club.avif', // This is the magic link
    isPopular: true,
  },
  {
    id: 'boxed-farmers-market',
    title: "Farmer's Market",
    description: 'Avocado slices, lettuce, tomato, onions, roasted red bell peppers, mushrooms, clover sprouts, pickles, Erik’s sweet hot mustard on hearty 9 grain bread.',
    price: 16.99,
    category: 'Boxed Lunches',
    dietary_tags: ['V'],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/farmers-market.avif', // This is the magic link
  },
  {
    id: 'boxed-del-monte-special',
    title: 'Del Monte Special',
    description: 'Monterey Jack cheese, avocado slices, tomato, onions, clover sprouts, Erik’s Secret Goo® on hearty 9 grain bread.',
    price: 16.99,
    category: 'Boxed Lunches',
    dietary_tags: ['V'],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/del-monte-special.avif', // This is the magic link
  },
  {
    id: 'boxed-reo-speedwagon',
    title: 'R.E.O. Speedwagon',
    description: 'Tender turkey breast, smoked ham, Monterey Jack cheese, tomato, onions, clover sprouts, Erik’s Secret Goo® on sourdough bread.',
    price: 16.99,
    category: 'Boxed Lunches',
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/reo-speedwagon.avif', // This is the magic link
  },
  {
    id: 'boxed-ciao-down',
    title: 'Ciao Down',
    description: 'Tender turkey breast, traditional salami, Swiss cheese, tomato, onions, hot cherry peppers, clover sprouts, basil pesto on a Dutch crunch roll. Spicy.',
    price: 16.99,
    category: 'Boxed Lunches',
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/ciao-down.avif', // This is the magic link
  },
  {
    id: 'boxed-california-crunch',
    title: 'California Crunch',
    description: 'Tender turkey breast, pastrami, Monterey Jack cheese, avocado slices, tomato, onions, clover sprouts, Erik’s Secret Goo® on a Dutch crunch roll.',
    price: 16.99,
    category: 'Boxed Lunches',
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/california-crunch.avif', // This is the magic link
  },
  {
    id: 'boxed-pot-belly',
    title: 'Pot Belly',
    description: 'Tender turkey breast, pastrami, Monterey Jack cheese, tomato, onions, clover sprouts, Erik’s Secret Goo® on sourdough bread.',
    price: 16.99,
    category: 'Boxed Lunches',
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/pot-belly.avif', // This is the magic link
  },
  {
    id: 'boxed-turkey-pesto',
    title: 'Turkey with Pesto',
    description: 'Tender turkey breast, Monterey Jack cheese, avocado slices, red onions, tomato, clover sprouts, basil pesto on hearty 9 grain bread.',
    price: 16.99,
    category: 'Boxed Lunches',
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/turkey-pesto.avif', // This is the magic link
  },
  {
    id: 'boxed-cleopatra-wrap',
    title: 'Cleopatra Wrap',
    description: 'Grilled chicken breast, avocado slices, shredded Romaine lettuce, tomatoes and parmesan cheese tossed with croutons and Caesar dressing in a wheat wrap.',
    price: 16.99,
    category: 'Boxed Lunches',
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/cleopatra-wrap.avif', // This is the magic link
  },
  {
    id: 'boxed-hail-caesar-wrap',
    title: 'Hail Caesar Wrap',
    description: 'Grilled chicken breast, shredded Romaine lettuce, and parmesan cheese tossed with croutons and Caesar dressing in a wheat wrap.',
    price: 16.99,
    category: 'Boxed Lunches',
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/hail-caesar-wrap.avif', // This is the magic link
  },
  {
    id: 'boxed-abbotts-habit',
    title: "Abbott's Habit",
    description:
      'Thinly sliced roast beef, Swiss cheese, mushrooms, Erik’s Secret Goo® on a French roll.',
    price: 16.99,
    category: 'Boxed Lunches',
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/abbotts-habit.avif', // This is the magic link
  },
  {
    id: 'boxed-chicken-durango',
    title: 'Chicken Durango',
    description:
      'Grilled chicken breast, hickory smoked bacon, cheddar cheese, onions, tomatoes, clover sprouts and tangy ranch dressing on a ciabatta roll.',
    price: 16.99,
    category: 'Boxed Lunches',
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/chicken-durango.avif', // This is the magic link
  },
  {
    id: 'boxed-chicken-pesto',
    title: 'Chicken Pesto',
    description:
      'Grilled chicken breast, pepper jack cheese, onions, tomatoes, clover sprouts and basil pesto on an onion roll.',
    price: 16.99,
    category: 'Boxed Lunches',
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/chicken-pesto.avif', // This is the magic link
  },
  {
    id: 'boxed-erik-berger',
    title: 'Erik "Berger',
    description:
      'Smoked ham, Monterey Jack cheese, tomato, onions, clover sprouts, Erik’s Secret Goo® on an onion roll.',
    price: 16.99,
    category: 'Boxed Lunches',
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/erik-berger.avif', // This is the magic link
  },
  {
    id: 'boxed-eriks-reuben',
    title: "Erik's Reuben",
    description:
      "Thinly sliced pastrami, Swiss cheese, sauerkraut on marble rye.",
    price: 16.99,
    category: 'Boxed Lunches',
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/eriks-reuben.avif', // This is the magic link
  },
  {
    id: 'boxed-italian-job',
    title: 'Italian Job',
    description:
      'Traditional salami, ham, mortadella, provolone, shredded Romaine, cherry peppers, onions, tomatoes, Secret Goo, herb-red wine vinaigrette on a French roll.',
    price: 16.99,
    category: 'Boxed Lunches',
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/italian-job.avif', // This is the magic link
  },
  {
    id: 'boxed-raging-bull',
    title: 'Raging Bull',
    description:
      'Tender seasoned roast beef with pepper jack cheese, mild green peppers, onions, tomatoes, clover sprouts and Secret Goo on an onion roll.',
    price: 16.99,
    category: 'Boxed Lunches',
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/raging-bull.avif', // This is the magic link
  },
  {
    id: 'boxed-rio-grande-club',
    title: 'Rio Grande Club',
    description:
      'Tender turkey breast, hickory smoked bacon, Pepper Jack cheese, avocado slices, lettuce, tomato, Erik’s Secret Goo® on ciabatta.',
    price: 16.99,
    category: 'Boxed Lunches',
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/rio-grande-club.avif', // This is the magic link
  },
  {
    id: 'boxed-sea-dog',
    title: 'Sea Dog',
    description:
      'Handcrafted tuna salad, cheddar, avocado, onions, tomatoes, and Erik’s Secret Goo® on sliced sourdough.',
    price: 16.99,
    category: 'Boxed Lunches',
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/sea-dog.avif', // This is the magic link
  },
  {
    id: 'boxed-sweet-liberty',
    title: 'Sweet Liberty',
    description:
      "Tender turkey breast, Swiss cheese, tomato, onions, roasted red bell peppers, clover sprouts, Erik’s sweet hot mustard on hearty 9 grain bread.",
    price: 16.99,
    category: 'Boxed Lunches',
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/sweet-liberty.avif', // This is the magic link
  },
  {
    id: BOXED_GF_CUSTOM_ITEM_ID,
    title: 'Gluten Free (Custom)',
    description:
      "A specialized gluten-free boxed lunch. Choose from 21 Erik's sandwiches prepared on gluten-free bread. Includes Lay's Potato Chips (GF) and a Chewy Marshmallow Manifesto Bar (GF).",
    price: 19.49,
    category: 'Boxed Lunches',
    dietary_tags: ['GF'],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/gf-boxed-lunch.avif',
  },
  /* ----- Catering Packages & Sandwich Trays (after Boxed Lunches) ----- */
  {
    id: 'tray-just-sandwiches',
    title: 'Just the Sandwiches Tray',
    description: 'Includes your choice of 12 sandwiches cut in half. Serves 12–24 people.',
    price: 139.99,
    category: 'Catering Packages & Sandwich Trays',
    dietary_tags: [],
    packaging_type: 'Tray',
    serves_count: 24,
    is_taxable: false,
    imagePath: '/images/menu/just-sandwiches.avif', // This is the magic link
    isPopular: true,
  },
  {
    id: 'tray-deluxe-sandwiches-character',
    title: 'Deluxe Sandwiches w/ Character',
    description:
      'Includes your choice of Deluxe sandwich (12 cut in half), side salad, and a dozen cookies.',
    price: 249.99,
    category: 'Catering Packages & Sandwich Trays',
    dietary_tags: [],
    packaging_type: 'Tray',
    serves_count: 24,
    is_taxable: false,
    imagePath: '/images/menu/deluxe-sandwiches-character.avif', // This is the magic link
    isPopular: true,
  },
  /* ----- Individual Salads ----- */
  {
    id: 'salad-chicken-gorgonzola',
    title: 'Chicken Gorgonzola Salad',
    description:
      'Chicken, garden salad mix, Gorgonzola, Craisins®, honey maple walnuts, blueberry pomegranate vinaigrette.',
    price: 12.79,
    category: INDIVIDUAL_SALADS_CATEGORY,
    dietary_tags: ['GF'],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/chicken-gorgonzola.avif', // This is the magic link
  },
  {
    id: 'salad-mandarin-tree',
    title: 'Mandarin Tree Salad',
    description:
      "Romaine with grilled chicken breast, red bell pepper, Mandarin oranges, crisp cucumber, wonton strips, and Erik's special sesame dressing.",
    price: 12.49,
    category: INDIVIDUAL_SALADS_CATEGORY,
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/mandarin-tree.avif', // This is the magic link
  },
  {
    id: 'salad-house-entree',
    title: 'House Salad',
    description:
      'Garden salad mix, cherry tomato, cucumber, red bell pepper, clover sprouts, croutons & balsamic vinaigrette.',
    price: 8.99,
    category: INDIVIDUAL_SALADS_CATEGORY,
    dietary_tags: ['GF', 'VG', 'V'],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/house-entree.avif', // This is the magic link
  },
  {
    id: 'salad-baja-fiesta',
    title: 'Baja Fiesta Salad',
    description:
      "Romaine with grilled chicken breast, baja bean salad, cheddar, avocado, cilantro, red bell pepper, cherry tomato, tri-color tortilla strips, and Erik's jalapeño ranch dressing.",
    price: 12.49,
    category: INDIVIDUAL_SALADS_CATEGORY,
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/baja-fiesta.avif', // This is the magic link
  },
  {
    id: 'salad-caesar-entree',
    title: 'Caesar Salad',
    description: 'Romaine lettuce, Parmesan cheese, croutons & Caesar dressing.',
    price: 8.99,
    category: INDIVIDUAL_SALADS_CATEGORY,
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/caesar-entree.avif', // This is the magic link
  },
  /* ----- Catering Salads (Serves 12) ----- */
  {
    id: 'bowl-catering-house',
    title: 'Catering House Salad',
    description:
      'Garden salad mix, cherry tomato, cucumber, red bell pepper, clover sprouts, croutons & balsamic vinaigrette.',
    price: 49.99,
    category: CATERING_SALADS_SERVES_12_CATEGORY,
    dietary_tags: ['GF', 'VG', 'V'],
    packaging_type: 'Tray',
    serves_count: 12,
    is_taxable: false,
    imagePath: '/images/menu/house-entree.avif', // This is the magic link
  },
  {
    id: 'bowl-catering-caesar',
    title: 'Catering Caesar Salad',
    description: 'Romaine lettuce, Parmesan cheese, croutons & Caesar dressing.',
    price: 49.99,
    category: CATERING_SALADS_SERVES_12_CATEGORY,
    dietary_tags: [],
    packaging_type: 'Tray',
    serves_count: 12,
    is_taxable: false,
    imagePath: '/images/menu/caesar-entree.avif', // This is the magic link
  },
  {
    id: 'bowl-catering-baja-fiesta',
    title: 'Catering Baja Fiesta Salad',
    description:
      'Chicken, romaine, baja bean salad, cheddar, avocado, red bell pepper, cherry tomatoes, with jalapeño ranch dressing and tri-color tortilla strips.',
    price: 64.99,
    category: CATERING_SALADS_SERVES_12_CATEGORY,
    dietary_tags: [],
    packaging_type: 'Tray',
    serves_count: 12,
    is_taxable: false,
    imagePath: '/images/menu/baja-fiesta.avif', // This is the magic link
  },
  {
    id: 'bowl-catering-chicken-gorgonzola',
    title: 'Catering Chicken Gorgonzola Salad',
    description:
      'Chicken, garden salad mix, Gorgonzola, Craisins®, honey maple walnuts, blueberry pomegranate vinaigrette.',
    price: 68.99,
    category: CATERING_SALADS_SERVES_12_CATEGORY,
    dietary_tags: ['GF'],
    packaging_type: 'Tray',
    serves_count: 12,
    is_taxable: false,
    imagePath: '/images/menu/chicken-gorgonzola.avif', // This is the magic link
  },
  {
    id: 'bowl-catering-mandarin-tree',
    title: 'Catering Mandarin Tree Salad',
    description:
      'Chicken, romaine, red bell pepper, Mandarin oranges, cucumber, wonton strips, sesame dressing.',
    price: 64.99,
    category: CATERING_SALADS_SERVES_12_CATEGORY,
    dietary_tags: [],
    packaging_type: 'Tray',
    serves_count: 12,
    is_taxable: false,
    imagePath: '/images/menu/mandarin-tree.avif', // This is the magic link
  },
  /* ----- Sides ----- */
  {
    id: 'side-pasta-salad',
    title: 'Pasta Salad',
    description:
      'Spiral tricolor rotelli egg pasta, artichoke pieces and fresh mushroom slices dressed with our special oil and vinegar marinade.',
    price: 17.49,
    category: SIDES_CATEGORY,
    dietary_tags: ['V'],
    packaging_type: 'Tray',
    serves_count: 6,
    is_taxable: false,
    imagePath: '/images/menu/pasta-salad.avif', // This is the magic link
  },
  {
    id: 'side-macaroni-salad',
    title: 'Macaroni Salad',
    description: 'Semolina wheat noodles gently tossed with carrots, onions, celery and a creamy top-shelf mayonnaise dressing.',
    price: 17.49,
    category: SIDES_CATEGORY,
    dietary_tags: [],
    packaging_type: 'Tray',
    serves_count: 6,
    is_taxable: false,
    imagePath: '/images/menu/macaroni-salad.avif', // This is the magic link
  },
  {
    id: 'side-potato-salad',
    title: 'Potato Salad',
    description: 'Tender white potatoes tossed with fresh carrots, celery, and onions in a creamy, classic deli dressing.',
    price: 17.49,
    category: SIDES_CATEGORY,
    dietary_tags: [],
    packaging_type: 'Tray',
    serves_count: 6,
    is_taxable: false,
    imagePath: '/images/menu/potato-salad.avif', // This is the magic link
  },
  {
    id: 'side-potato-chips',
    title: 'Potato Chips',
    description: 'Individual Packaging.',
    price: 1.99,
    category: SIDES_CATEGORY,
    dietary_tags: ['V'],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/potato-chips.avif', // This is the magic link
  },
  {
    id: 'side-bbq-chips',
    title: 'BBQ Chips',
    description: 'Individual Packaging.',
    price: 1.99,
    category: SIDES_CATEGORY,
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/bbq-chips.avif', // This is the magic link
  },
  {
    id: 'side-jalapeno-chips',
    title: 'Jalapeño Chips',
    description: 'Individual Packaging.',
    price: 1.99,
    category: SIDES_CATEGORY,
    dietary_tags: ['V'],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/jalapeno-chips.avif', // This is the magic link
  },
  {
    id: 'side-salt-vinegar-chips',
    title: 'Salt & Vinegar Chips',
    description: 'Individual Packaging.',
    price: 1.99,
    category: SIDES_CATEGORY,
    dietary_tags: ['V'],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/salt-vinegar-chips.avif', // This is the magic link
  },
  {
    id: 'side-sun-chips',
    title: 'Sun Chips',
    description: 'Individual Packaging.',
    price: 1.99,
    category: SIDES_CATEGORY,
    dietary_tags: ['V'],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/sun-chips.avif', // This is the magic link
  },
  /* ----- Desserts (under Sides) ----- */
  {
    id: 'dessert-assorted-sweets',
    title: 'Assorted Sweets',
    description: 'Includes an assortment of all our sweet treats.',
    price: 44.99,
    category: DESSERTS_CATEGORY,
    dietary_tags: ['V'],
    packaging_type: 'Tray',
    serves_count: 12,
    is_taxable: false,
    imagePath: '/images/menu/assorted-sweets.avif', // This is the magic link
  },
  {
    id: 'dessert-sandy-chocolate-cookie',
    title: "Sandy's Amazing Chocolate Chip Cookie",
    description:
      'Chunks of sustainable chocolates grown in the Peruvian Andes and pretzel bits in every bite.',
    price: 3.29,
    category: DESSERTS_CATEGORY,
    dietary_tags: ['V'],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/sandy-chocolate-cookie.avif', // This is the magic link
  },
  {
    id: 'dessert-salted-caramel-manifesto-cookie',
    title: 'Salted Caramel Manifesto Cookie',
    description:
      'Toffee, white chocolate chunks, pretzel bits and sea salt topped with pretzel salt and golden-baked edges.',
    price: 3.29,
    category: DESSERTS_CATEGORY,
    dietary_tags: ['V'],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/salted-caramel-manifesto-cookie.avif', // This is the magic link
  },
  {
    id: 'dessert-chewy-marshmallow-manifesto-bar',
    title: 'Chewy Marshmallow Manifesto Bar',
    description:
      'Homemade mini-marshmallows with gluten-free crispy rice puffs, brown butter, and a hint of sea salt.',
    price: 3.29,
    category: DESSERTS_CATEGORY,
    dietary_tags: ['GF', 'V'],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/chewy-marshmallow-manifesto-bar.avif', // This is the magic link
  },
  {
    id: 'dessert-peruvian-chocolate-manifesto-brownie',
    title: 'Peruvian Chocolate Manifesto Brownie',
    description: 'Rich, dense chocolate brownie with sustainably sourced Peruvian chocolate.',
    price: 3.49,
    category: DESSERTS_CATEGORY,
    dietary_tags: ['V'],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/peruvian-chocolate-manifesto-brownie.avif', // This is the magic link
  },
  {
    id: 'dessert-carrot-cake',
    title: 'Carrot Cake',
    description:
      "Our famous carrot cake is made from Grammie's time-tested family recipe, filled with carrots, warm spices, and walnuts.",
    price: 58.99,
    category: DESSERTS_CATEGORY,
    dietary_tags: ['V'],
    packaging_type: 'Tray',
    serves_count: 10,
    is_taxable: false,
    imagePath: '/images/menu/carrot-cake.avif', // This is the magic link
  },
  /* ----- Beverages (under Desserts) ----- */
  {
    id: 'bev-bottled-water',
    title: 'Bottle Water',
    description: 'Still water — individual bottle (not carbonated; typically exempt to-go in CA).',
    price: 2.49,
    category: BEVERAGES_CATEGORY,
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/bottled-water.avif',
  },
  {
    id: 'bev-sparkling-water',
    title: 'Perrier Sparkling Water',
    description: 'Perrier carbonated mineral water — individual bottle (taxable).',
    price: 2.49,
    category: BEVERAGES_CATEGORY,
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: true,
    imagePath: '/images/menu/sparkling-water.avif',
  },
  {
    id: 'bev-lacroix-grapefruit',
    title: 'LaCroix (Grapefruit)',
    description: 'Naturally essenced sparkling water – individual can.',
    price: 2.49,
    category: BEVERAGES_CATEGORY,
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: true,
    imagePath: '/images/menu/lacroix-grapefruit.avif',
  },
  {
    id: 'bev-lacroix-lime',
    title: 'LaCroix (Lime)',
    description: 'Naturally essenced sparkling water – individual can.',
    price: 2.49,
    category: BEVERAGES_CATEGORY,
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: true,
    imagePath: '/images/menu/lacroix-lime.avif',
  },
  {
    id: 'bev-canned-coke',
    title: 'Canned Coke',
    description: 'Individual can.',
    price: 2.79,
    category: BEVERAGES_CATEGORY,
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: true,
    imagePath: '/images/menu/canned-coke.avif',
  },
  {
    id: 'bev-canned-diet-coke',
    title: 'Canned Diet Coke',
    description: 'Individual can.',
    price: 2.79,
    category: BEVERAGES_CATEGORY,
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: true,
    imagePath: '/images/menu/canned-diet-coke.avif',
  },
  {
    id: 'bev-coke-zero',
    title: 'Canned Coke Zero',
    description: 'Individual can.',
    price: 2.79,
    category: BEVERAGES_CATEGORY,
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: true,
    imagePath: '/images/menu/canned-coke-zero.avif',
  },
  {
    id: 'bev-canned-sprite',
    title: 'Canned Sprite',
    description: 'Individual can.',
    price: 2.79,
    category: BEVERAGES_CATEGORY,
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: true,
    imagePath: '/images/menu/canned-sprite.avif',
  },
  {
    id: 'bev-arizona-arnold-palmer',
    title: 'Arizona Arnold Palmer',
    description: 'Description and photo coming soon.',
    price: 2.79,
    category: BEVERAGES_CATEGORY,
    dietary_tags: [],
    packaging_type: 'Individual',
    serves_count: 1,
    is_taxable: false,
    imagePath: '/images/menu/arizona-arnold-palmer.avif',
  },
]

export function boxedLunchSandwichTitlesForGfPortal(): string[] {
  return MENU_DATA_ITEMS.filter(
    (r) => r.category === 'Boxed Lunches' && r.id !== BOXED_GF_CUSTOM_ITEM_ID,
  )
    .map((r) => r.title)
    .sort((a, b) => a.localeCompare(b))
}

/** Alias for consumers that prefer the prompt naming (`menuItems`). */
export const menuItems = MENU_DATA_ITEMS
