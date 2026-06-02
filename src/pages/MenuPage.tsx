import { useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'

import { menuItems, MENU_NAV_CATEGORIES } from '../data/menuData'
import { menuDataItemToMenuItem } from '../data/menuItems'
import type { MenuItem } from '../types/menu'
import { CartSidebar } from '../components/cart/CartSidebar'
import { BoxedLunchCustomizeModal } from '../components/menu/BoxedLunchCustomizeModal'
import { ItemCustomizeModal } from '../components/menu/ItemCustomizeModal'
import { MenuItemTile } from '../components/menu/MenuItemTile'
import { HeadcountModal } from '../components/checkout/HeadcountModal'
import { OrderConfirmation } from '../components/checkout/OrderConfirmation'
import { PaymentPanel } from '../components/checkout/PaymentPanel'
import { useCateringStore } from '../store/cateringStore'

function categoryAnchorId(category: string): string {
  return `cat-${category.replace(/\s+/g, '-').toLowerCase()}`
}

export function MenuPage() {
  const onboardingValid = useCateringStore((s) => s.onboardingValid)
  const paymentEmail = useCateringStore((s) => s.paymentEmail)
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null)
  const [headcountOpen, setHeadcountOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [orderConfirmation, setOrderConfirmation] = useState<{ orderNumber: string } | null>(null)

  const menuItemsRuntime = useMemo((): MenuItem[] => menuItems.map(menuDataItemToMenuItem), [])

  const itemsByCategory = useMemo(() => {
    const map = new Map<string, MenuItem[]>()
    for (const cat of MENU_NAV_CATEGORIES) {
      map.set(cat, menuItemsRuntime.filter((i) => i.category === cat))
    }
    return map
  }, [menuItemsRuntime])

  if (!onboardingValid()) {
    return <Navigate to="/" replace />
  }

  const scrollToCategory = (cat: string) => {
    const id = categoryAnchorId(cat)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-svh overflow-visible bg-stone-100 text-stone-900">
      <header className="sticky top-0 z-20 bg-white">
        <div className="relative flex h-20 items-center justify-center border-b border-stone-200 bg-white px-4">
          <img
            src="/banner-logo.avif"
            alt="Erik's DeliCafe"
            className="h-12 w-auto object-contain"
          />
          <Link
            to="/"
            className="absolute right-6 text-sm font-medium text-emerald-900 underline underline-offset-4 hover:text-emerald-700 lg:right-12"
          >
            Edit event details
          </Link>
        </div>
        <nav className="border-b border-stone-200 bg-white">
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2 text-sm">
            {MENU_NAV_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => scrollToCategory(cat)}
                className="whitespace-nowrap rounded-full bg-stone-100 px-3 py-1.5 font-medium text-stone-800 ring-1 ring-stone-200 hover:bg-stone-200"
              >
                {cat}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-4 overflow-visible px-4 py-6 lg:flex-row">
        <main className="min-w-0 flex-1 space-y-10 pb-24 lg:pb-8">
          {MENU_NAV_CATEGORIES.map((cat) => {
            const items = itemsByCategory.get(cat) ?? []
            return (
              <section
                key={cat}
                id={categoryAnchorId(cat)}
                className="scroll-mt-32 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-xl font-semibold tracking-tight">{cat}</h2>
                  <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
                    {items.length} items
                  </span>
                </div>
                {items.length === 0 ? (
                  <p className="mt-4 text-sm text-stone-600">
                    No items match your filters in this category.
                  </p>
                ) : (
                  <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2">
                    {items.map((item) => (
                      <MenuItemTile key={item.id} item={item} onSelect={() => setActiveItem(item)} />
                    ))}
                  </div>
                )}
              </section>
            )
          })}
        </main>

        <aside className="lg:sticky lg:top-28 lg:z-10 lg:h-[calc(100vh-120px)] lg:w-96 lg:shrink-0 lg:self-start">
          <CartSidebar
            onCheckout={() => {
              setHeadcountOpen(true)
            }}
          />
        </aside>
      </div>

      {activeItem &&
        (activeItem.category === 'Boxed Lunches' ? (
          <BoxedLunchCustomizeModal item={activeItem} onClose={() => setActiveItem(null)} />
        ) : (
          <ItemCustomizeModal item={activeItem} onClose={() => setActiveItem(null)} />
        ))}

      {headcountOpen && (
        <HeadcountModal
          onClose={() => setHeadcountOpen(false)}
          onProceed={() => {
            setHeadcountOpen(false)
            setPaymentOpen(true)
          }}
          onBackToMenu={() => setHeadcountOpen(false)}
        />
      )}

      {paymentOpen && !orderConfirmation && (
        <PaymentPanel
          onClose={() => setPaymentOpen(false)}
          onHelcimSuccess={({ orderNumber }) => {
            setPaymentOpen(false)
            setOrderConfirmation({ orderNumber })
          }}
        />
      )}

      {orderConfirmation && (
        <OrderConfirmation
          orderNumber={orderConfirmation.orderNumber}
          confirmationEmail={paymentEmail}
          onReturnToMenu={() => {
            useCateringStore.getState().clearCart()
            setOrderConfirmation(null)
            setPaymentOpen(false)
            setHeadcountOpen(false)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        />
      )}
    </div>
  )
}
