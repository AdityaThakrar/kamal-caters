import { formatMoney } from '../../lib/money'
import { cartLineFoodSubtotal, boxedCartPrimaryLabel } from '../../lib/boxedLunch'
import { trayCartSummaryLabel } from '../../lib/trayPackage'
import { isDeluxeTrayCompositeCartTitle } from '../../lib/deluxeCharacterTray'
import { MINIMUM_ORDER_SUBTOTAL, meetsOrderMinimum, orderMinimumShortfall } from '../../lib/cartRules'
import { TaxHelpLabel } from '../TaxHelpLabel'
import { getMenuItemById } from '../../data/menuItems'
import type { ExcludableIngredient } from '../../types/menu'
import { useCateringStore } from '../../store/cateringStore'

interface Props {
  onCheckout: () => void
}

const TIP_PRESETS = [5, 10, 15, 20] as const

function formatExclusions(excluded: Partial<Record<ExcludableIngredient, boolean>>): string {
  const keys = (Object.keys(excluded) as ExcludableIngredient[]).filter((k) => excluded[k])
  if (!keys.length) return ''
  return keys.map((k) => `No ${k}`).join(', ')
}

export function CartSidebar({ onCheckout }: Props) {
  const cart = useCateringStore((s) => s.cart)
  const updateLineQty = useCateringStore((s) => s.updateLineQty)
  const removeLine = useCateringStore((s) => s.removeLine)
  const subtotal = useCateringStore((s) => s.subtotal)
  const taxAmount = useCateringStore((s) => s.taxAmount)
  const deliveryFee = useCateringStore((s) => s.deliveryFee)
  const tipAmount = useCateringStore((s) => s.tipAmount)
  const total = useCateringStore((s) => s.total)
  const tipPreset = useCateringStore((s) => s.tipPreset)
  const setTipPreset = useCateringStore((s) => s.setTipPreset)
  const tipOtherPercent = useCateringStore((s) => s.tipOtherPercent)
  const setTipOtherPercent = useCateringStore((s) => s.setTipOtherPercent)

  const sub = subtotal()
  const meetsMin = meetsOrderMinimum(sub)
  const shortfall = orderMinimumShortfall(sub)
  const canProceedToCheckout = cart.length > 0 && meetsMin
  const minProgressPct = Math.min(100, (sub / MINIMUM_ORDER_SUBTOTAL) * 100)

  return (
    <div className="w-full lg:flex lg:h-full lg:min-h-0 lg:flex-col">
      <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm lg:flex-1 lg:h-full">
        <div className="shrink-0 border-b border-stone-100 px-4 py-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">Your cart</h2>
          <p className="text-xs text-stone-500">Updates as you build trays and boxed lunches.</p>
        </div>

        <div className="max-h-72 min-h-0 space-y-3 overflow-y-auto px-4 py-3 lg:max-h-none lg:flex-1">
          {cart.length === 0 && (
            <p className="text-sm text-stone-600">No items yet — tap a menu card to customize.</p>
          )}
          {cart.map((line) => {
            const item = getMenuItemById(line.menuItemId)
            if (!item) return null
            const extras = formatExclusions(line.excluded)
            return (
              <div
                key={line.lineId}
                className="rounded-xl border border-stone-200 bg-stone-50/60 p-3 text-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-stone-900">
                      {line.boxedLunch
                        ? boxedCartPrimaryLabel(line, item.name)
                        : line.trayPackage
                          ? trayCartSummaryLabel(line, item.name)
                          : item.name}
                    </p>
                    {extras && <p className="text-xs text-emerald-900">{extras}</p>}
                    {line.trayPackage && !isDeluxeTrayCompositeCartTitle(line) && (
                      <p className="text-xs text-stone-600">
                        <span className="font-medium text-stone-700">Sandwich configuration:</span>{' '}
                        {line.trayPackage.trayConfiguration}
                      </p>
                    )}
                    {line.nameOnBox && (
                      <p className="text-xs text-stone-600">
                        {line.qty > 1 ? 'Batch label:' : 'Box name:'}{' '}
                        <span className="font-medium">{line.nameOnBox}</span>
                      </p>
                    )}
                    {(line.boxedLunch?.specialInstructions ||
                      line.trayPackage?.specialInstructions ||
                      line.specialInstructions) && (
                      <p className="mt-1 text-xs text-stone-600">
                        <span className="font-medium text-stone-700">Note:</span>{' '}
                        {line.boxedLunch?.specialInstructions ??
                          line.trayPackage?.specialInstructions ??
                          line.specialInstructions}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    className="text-xs font-semibold text-red-700 hover:underline"
                    onClick={() => removeLine(line.lineId)}
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <label className="flex items-center gap-2 text-xs text-stone-600">
                    {line.boxedLunch ? 'Guests' : 'Qty'}
                    <input
                      type="number"
                      min={1}
                      className="w-16 rounded-lg border border-stone-300 px-2 py-1 text-sm"
                      value={line.qty}
                      onChange={(e) =>
                        updateLineQty(line.lineId, Number.parseInt(e.target.value, 10) || 1)
                      }
                    />
                  </label>
                  <p className="text-sm font-semibold text-stone-900">
                    {formatMoney(cartLineFoodSubtotal(line, getMenuItemById))}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="shrink-0 border-t border-stone-100 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Tip</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {TIP_PRESETS.map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setTipPreset(pct)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 transition ${
                  tipPreset === pct
                    ? 'bg-emerald-900 text-white ring-emerald-900'
                    : 'bg-white text-stone-800 ring-stone-200 hover:bg-stone-50'
                }`}
              >
                {pct}%
              </button>
            ))}
            <button
              type="button"
              onClick={() => setTipPreset('other')}
              className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 transition ${
                tipPreset === 'other'
                  ? 'bg-emerald-900 text-white ring-emerald-900'
                  : 'bg-white text-stone-800 ring-stone-200 hover:bg-stone-50'
              }`}
            >
              Other
            </button>
          </div>
          {tipPreset === 'other' && (
            <label className="mt-2 flex items-center gap-2 text-xs text-stone-600">
              Custom %
              <input
                type="number"
                min={0}
                step={1}
                className="w-20 rounded-lg border border-stone-300 px-2 py-1 text-sm"
                value={tipOtherPercent}
                onChange={(e) => setTipOtherPercent(Number.parseFloat(e.target.value) || 0)}
              />
            </label>
          )}
        </div>

        <div className="shrink-0 space-y-2 border-t border-stone-100 px-4 py-3 text-sm">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal</span>
            <span className="font-medium text-stone-900">{formatMoney(subtotal())}</span>
          </div>
          <div className="flex justify-between text-stone-600">
            <TaxHelpLabel />
            <span className="font-medium text-stone-900">{formatMoney(taxAmount())}</span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>Delivery fee</span>
            <span className="font-medium text-stone-900">{formatMoney(deliveryFee())}</span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>Tip</span>
            <span className="font-medium text-stone-900">{formatMoney(tipAmount())}</span>
          </div>
          <div className="flex justify-between border-t border-dashed border-stone-200 pt-2 text-base font-semibold text-stone-900">
            <span>Total</span>
            <span>{formatMoney(total())}</span>
          </div>
        </div>

        <div className="shrink-0 space-y-3 px-4 pb-4">
          {cart.length > 0 && !meetsMin && (
            <div className="space-y-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5">
              <p className="text-xs font-medium leading-snug text-emerald-950">
                Add {formatMoney(shortfall)} more to reach the {formatMoney(MINIMUM_ORDER_SUBTOTAL)} order
                minimum.
              </p>
              <div className="h-2 overflow-hidden rounded-full bg-emerald-200/80">
                <div
                  className="h-full rounded-full bg-emerald-900 transition-[width] duration-300 ease-out"
                  style={{ width: `${minProgressPct}%` }}
                />
              </div>
            </div>
          )}
          <button
            type="button"
            disabled={!canProceedToCheckout}
            onClick={onCheckout}
            className={`w-full rounded-full py-3 text-sm font-semibold shadow-sm ${
              !canProceedToCheckout
                ? 'cursor-not-allowed bg-stone-200 text-stone-500'
                : 'bg-emerald-900 text-white hover:bg-emerald-950'
            }`}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  )
}
