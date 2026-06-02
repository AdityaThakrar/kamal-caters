import { Link } from 'react-router-dom'

import { getMenuItemById } from '../../data/menuItems'
import { boxedCartPrimaryLabel } from '../../lib/boxedLunch'
import { trayCartSummaryLabel } from '../../lib/trayPackage'
import { isDeluxeTrayCompositeCartTitle } from '../../lib/deluxeCharacterTray'
import { lineExceedsHeadcount, totalHeavilyExceedsHeadcount } from '../../lib/servings'
import { cartLineServings, cartTotalServings, useCateringStore } from '../../store/cateringStore'

interface Props {
  onClose: () => void
  onProceed: () => void
  onBackToMenu: () => void
}

export function HeadcountModal({ onClose, onProceed, onBackToMenu }: Props) {
  const headcount = useCateringStore((s) => s.headcount)
  const cart = useCateringStore((s) => s.cart)

  const hc = headcount ?? 0
  const totalServings = cartTotalServings(cart)
  const heavy = totalHeavilyExceedsHeadcount(totalServings, hc)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl ring-1 ring-stone-200">
        <div className="flex items-start justify-between gap-3 border-b border-stone-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">Have enough food for everyone?</h2>
            <p className="mt-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-950 ring-1 ring-emerald-200">
              Your headcount is{' '}
              <span className="font-semibold">
                {hc} {hc === 1 ? 'person' : 'people'}
              </span>
              .
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-stone-500 hover:bg-stone-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4">
          {heavy && (
            <p className="mb-3 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-950">
              Total planned servings ({totalServings}) are comfortably above your headcount — scan
              the rows flagged with <span className="font-semibold">&quot;Too much?&quot;</span>.
            </p>
          )}
          <div className="overflow-hidden rounded-xl border border-stone-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 text-xs font-semibold uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="px-3 py-2">Qty</th>
                  <th className="px-3 py-2">Serves</th>
                  <th className="px-3 py-2">Item</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((line) => {
                  const item = getMenuItemById(line.menuItemId)
                  if (!item) return null
                  const lineServ = cartLineServings(line)
                  const rowHeavy = lineExceedsHeadcount(line.qty, item.serves_count, hc)
                  return (
                    <tr key={line.lineId} className="border-t border-stone-100">
                      <td className="px-3 py-2 align-top font-semibold text-stone-900">
                        {line.qty}
                      </td>
                      <td className="px-3 py-2 align-top text-stone-800">{lineServ}</td>
                      <td className="px-3 py-2 align-top">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <span className="font-medium text-stone-900">
                              {line.boxedLunch
                                ? boxedCartPrimaryLabel(line, item.name)
                                : line.trayPackage
                                  ? trayCartSummaryLabel(line, item.name)
                                  : item.name}
                            </span>
                            {line.trayPackage && !isDeluxeTrayCompositeCartTitle(line) && (
                              <p className="mt-0.5 text-xs font-normal text-stone-600">
                                {line.trayPackage.trayConfiguration}
                              </p>
                            )}
                          </div>
                          {rowHeavy && (
                            <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-900">
                              Too much?
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm text-stone-600">
            Are you set with drinks and dessert on this order?{' '}
            <button
              type="button"
              onClick={onBackToMenu}
              className="font-semibold text-emerald-800 underline-offset-2 hover:underline"
            >
              Back to menu
            </button>{' '}
            or keep this cart as-is.
          </p>
        </div>

        <div className="flex flex-col gap-2 border-t border-stone-100 px-5 py-4 sm:flex-row sm:justify-end">
          <Link
            to="/"
            className="inline-flex justify-center rounded-full px-4 py-2 text-sm font-semibold text-stone-700 ring-1 ring-stone-200 hover:bg-stone-50"
            onClick={onClose}
          >
            Edit headcount
          </Link>
          <button
            type="button"
            onClick={onProceed}
            className="inline-flex justify-center rounded-full bg-emerald-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-950"
          >
            I&apos;m good! Proceed to checkout
          </button>
        </div>
      </div>
    </div>
  )
}
