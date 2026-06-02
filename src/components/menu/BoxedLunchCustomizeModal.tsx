import { useMemo, useState } from 'react'

import { formatMoney } from '../../lib/money'
import {
  BOXED_CHIP_OPTIONS,
  BOXED_DESSERT_CHOICES,
  BOXED_GF_CUSTOM_ITEM_ID,
  BOXED_GF_LOCKED_CHIPS_CART,
  BOXED_GF_LOCKED_DESSERT_CART,
  BOXED_LUNCH_BASE_PER_PERSON,
  boxedDessertById,
  boxedLunchModalTotal,
  defaultBoxedDessertId,
} from '../../lib/boxedLunch'
import type { MenuItem } from '../../types/menu'
import { boxedLunchSandwichTitlesForGfPortal } from '../../data/menuData'
import { useCateringStore } from '../../store/cateringStore'
import { MenuItemTileImage } from './MenuItemTileImage'

const MOST_POPULAR_SUBTEXT =
  'The restaurant will deliver their most popular option. If you have dietary restrictions, note them in the special instructions below.'

interface Props {
  item: MenuItem
  onClose: () => void
}

function RequiredOptionMeta() {
  return (
    <p className="mt-1 flex items-center gap-1.5 text-xs text-stone-500">
      <svg
        className="size-3.5 shrink-0 text-emerald-600"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
      <span>Required • 1 option</span>
    </p>
  )
}

function GfCustomBoxedLunchModal({ item, onClose }: Props) {
  const addCartLine = useCateringStore((s) => s.addCartLine)
  const sandwichTitles = useMemo(() => boxedLunchSandwichTitlesForGfPortal(), [])
  const [quantity, setQuantity] = useState<string>('')
  const [selectedSandwich, setSelectedSandwich] = useState('')
  const [boxName, setBoxName] = useState('')
  const [specialInstructions, setSpecialInstructions] = useState('')

  const isValidQuantity = quantity !== '' && Number(quantity) > 0
  const showZeroQuantityError = quantity !== '' && Number(quantity) === 0
  const sandwichOk = selectedSandwich.length > 0
  const canAdd = isValidQuantity && sandwichOk

  const qtyParsedForNaming = quantity === '' ? NaN : Number(quantity)
  const namingIsBatch = Number.isFinite(qtyParsedForNaming) && qtyParsedForNaming > 1

  const displayQtyForFooter =
    quantity === '' ? 1 : isValidQuantity ? Math.min(999, Math.floor(Number(quantity))) : 0

  const currentTotal = Math.round(item.price * displayQtyForFooter * 100) / 100
  const footerCta = `Add to cart - ${formatMoney(currentTotal)}`

  const sandwichGroupName = `gf-sandwich-${item.id}`

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/50 p-0 sm:items-center sm:p-4">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl ring-1 ring-stone-200 sm:rounded-2xl">
        <div className="flex min-h-0 max-h-[92vh] flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-4">
            <div className="relative">
              <MenuItemTileImage item={item} className="mb-4 max-h-36 w-full rounded-xl object-cover" />
              <button
                type="button"
                onClick={onClose}
                className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-stone-600 shadow-sm ring-1 ring-stone-200 hover:bg-white hover:text-stone-900"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
              Gluten-free concierge package
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-stone-900">{item.name}</h2>
            <p className="mt-2 text-sm font-semibold text-stone-900">
              {formatMoney(item.price)} / person
            </p>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.description}</p>

            <section className="mt-6">
              <label className="text-sm font-semibold text-stone-900" htmlFor={`qty-gf-${item.id}`}>
                Select quantity:
              </label>
              <p className="mt-1 text-xs text-stone-500">Number of guests receiving this package.</p>
              <input
                id={`qty-gf-${item.id}`}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                maxLength={3}
                placeholder="e.g. 15"
                value={quantity}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 3)
                  setQuantity(digits)
                }}
                className="mt-2 w-full max-w-[8rem] rounded-xl border border-stone-300 px-3 py-2 text-base font-medium outline-none focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/15"
              />
              {showZeroQuantityError && (
                <p className="mt-2 text-xs text-red-600">Quantity must be 1 or more.</p>
              )}
            </section>

            <fieldset className="mt-6">
              <legend className="sr-only">Select sandwich, required, one option</legend>
              <p className="text-base font-semibold text-stone-900">
                Select sandwich (Served on GF bread):
              </p>
              <RequiredOptionMeta />
              <div
                className="mt-2 max-h-[300px] overflow-y-auto rounded-xl border border-stone-200 border-b-2 border-b-stone-300 bg-white pr-2 shadow-[inset_0_-10px_14px_-8px_rgba(0,0,0,0.07)] sm:max-h-[38vh]"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                <div className="flex w-full flex-col pb-6">
                  {sandwichTitles.map((title, i) => (
                    <label
                      key={title}
                      className={`flex w-full cursor-pointer flex-row items-start gap-3 px-3 py-4 ${
                        i < sandwichTitles.length - 1 ? 'border-b border-stone-200' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name={sandwichGroupName}
                        value={title}
                        checked={selectedSandwich === title}
                        onChange={() => setSelectedSandwich(title)}
                        className="mt-1 size-4 shrink-0 border-stone-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="min-w-0 flex-1 text-base text-stone-900">{title}</span>
                    </label>
                  ))}
                </div>
              </div>
              {!sandwichOk && isValidQuantity && (
                <p className="mt-2 text-xs text-emerald-800">Choose one sandwich from the list.</p>
              )}
            </fieldset>

            <section className="mt-6 space-y-3">
              <div className="rounded-xl bg-stone-100 px-3 py-3 text-sm text-stone-800 ring-1 ring-stone-200/80">
                <p className="font-semibold text-stone-900">Included Chips: Lay&apos;s Potato Chips (GF)</p>
                <p className="mt-1 text-xs text-stone-600">Locked for this package — always gluten-free.</p>
              </div>
              <div className="rounded-xl bg-stone-100 px-3 py-3 text-sm text-stone-800 ring-1 ring-stone-200/80">
                <p className="font-semibold text-stone-900">
                  Included Dessert: Chewy Marshmallow Manifesto Bar (GF)
                </p>
                <p className="mt-1 text-xs text-stone-600">Locked for this package — always gluten-free.</p>
              </div>
            </section>

            <section className="mt-6">
              <label className="text-sm font-semibold text-stone-900" htmlFor={`box-name-gf-${item.id}`}>
                {namingIsBatch ? (
                  <>
                    Label this batch <span className="font-normal text-stone-500">(optional)</span>
                  </>
                ) : (
                  <>
                    Name on box <span className="font-normal text-stone-500">(optional)</span>
                  </>
                )}
              </label>
              <input
                id={`box-name-gf-${item.id}`}
                value={boxName}
                onChange={(e) => setBoxName(e.target.value)}
                placeholder={
                  namingIsBatch
                    ? 'e.g. Marketing Team or Board Meeting'
                    : 'e.g. John — Finance'
                }
                className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/15"
              />
            </section>

            <section className="mt-6">
              <label className="text-sm font-semibold text-stone-900" htmlFor={`spl-gf-${item.id}`}>
                Add special instructions
              </label>
              <textarea
                id={`spl-gf-${item.id}`}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={3}
                placeholder="e.g. 1 box no tomatoes, allergies, drop-off notes…"
                className="mt-2 w-full resize-y rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/15"
              />
            </section>

            <div className="sticky bottom-0 z-20 -mx-5 mt-4 border-t border-stone-200 bg-white px-5 py-4 shadow-[0_-12px_32px_rgba(0,0,0,0.1)]">
              <button
                type="button"
                disabled={!canAdd}
                className={`w-full rounded-full py-3.5 text-sm font-semibold shadow-sm ${
                  canAdd
                    ? 'bg-emerald-900 text-white hover:bg-emerald-950'
                    : 'cursor-not-allowed bg-stone-200 text-stone-500'
                }`}
                onClick={() => {
                  if (!canAdd) return
                  const qty = Math.min(999, Math.floor(Number(quantity)))
                  addCartLine({
                    menuItemId: item.id,
                    qty,
                    excluded: {},
                    nameOnBox: boxName.trim() || undefined,
                    boxedLunch: {
                      chips: BOXED_GF_LOCKED_CHIPS_CART,
                      dessertSummary: BOXED_GF_LOCKED_DESSERT_CART,
                      dessertUpchargePerPerson: 0,
                      sandwichChoice: selectedSandwich,
                      specialInstructions: specialInstructions.trim() || undefined,
                    },
                  })
                  onClose()
                }}
              >
                {footerCta}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StandardBoxedLunchCustomizeModal({ item, onClose }: Props) {
  const addCartLine = useCateringStore((s) => s.addCartLine)

  const [quantity, setQuantity] = useState<string>('')
  const [selectedChips, setSelectedChips] = useState<string>(BOXED_CHIP_OPTIONS[0]!)
  const [selectedDessertId, setSelectedDessertId] = useState(defaultBoxedDessertId())
  const [boxName, setBoxName] = useState('')
  const [specialInstructions, setSpecialInstructions] = useState('')

  const dessertChoice = useMemo(
    () => boxedDessertById(selectedDessertId) ?? BOXED_DESSERT_CHOICES[0]!,
    [selectedDessertId],
  )

  const isValidQuantity = quantity !== '' && Number(quantity) > 0
  const showZeroQuantityError = quantity !== '' && Number(quantity) === 0

  const qtyParsedForNaming = quantity === '' ? NaN : Number(quantity)
  const namingIsBatch = Number.isFinite(qtyParsedForNaming) && qtyParsedForNaming > 1

  const displayQtyForFooter =
    quantity === '' ? 1 : isValidQuantity ? Math.min(999, Math.floor(Number(quantity))) : 0

  const currentTotal = boxedLunchModalTotal(displayQtyForFooter, dessertChoice.upchargePerPerson)
  const footerCta = `Add to cart - ${formatMoney(currentTotal)}`

  const chipGroupName = `boxed-chips-${item.id}`
  const dessertGroupName = `boxed-dessert-${item.id}`

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/50 p-0 sm:items-center sm:p-4">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl ring-1 ring-stone-200 sm:rounded-2xl">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4 pt-4">
          <div className="relative">
            <MenuItemTileImage item={item} className="mb-4 max-h-36 w-full rounded-xl object-cover" />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-stone-600 shadow-sm ring-1 ring-stone-200 hover:bg-white hover:text-stone-900"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
            Boxed lunch package
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-stone-900">{item.name}</h2>
          <p className="mt-2 text-sm font-semibold text-stone-900">
            Base price {formatMoney(BOXED_LUNCH_BASE_PER_PERSON)} / person
          </p>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.description}</p>

          <section className="mt-6">
            <label className="text-sm font-semibold text-stone-900" htmlFor={`qty-${item.id}`}>
              Select quantity:
            </label>
            <p className="mt-1 text-xs text-stone-500">Number of guests receiving this package.</p>
            <input
              id={`qty-${item.id}`}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={3}
              placeholder="e.g. 15"
              value={quantity}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 3)
                setQuantity(digits)
              }}
              className="mt-2 w-full max-w-[8rem] rounded-xl border border-stone-300 px-3 py-2 text-base font-medium outline-none focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/15"
            />
            {showZeroQuantityError && (
              <p className="mt-2 text-xs text-red-600">Quantity must be 1 or more.</p>
            )}
          </section>

          <fieldset className="mt-6">
            <legend className="sr-only">Select chips, required, one option</legend>
            <p className="text-base font-semibold text-stone-900">Select chips:</p>
            <RequiredOptionMeta />
            <div className="mt-2 flex w-full flex-col">
              {BOXED_CHIP_OPTIONS.map((opt, i) => (
                <label
                  key={opt}
                  className={`flex w-full cursor-pointer flex-row items-start gap-3 py-4 ${
                    i < BOXED_CHIP_OPTIONS.length - 1 ? 'border-b border-stone-200' : ''
                  }`}
                >
                  <input
                    type="radio"
                    className="mt-1 size-4 shrink-0 border-stone-300 text-emerald-700 focus:ring-emerald-600"
                    name={chipGroupName}
                    checked={selectedChips === opt}
                    onChange={() => setSelectedChips(opt)}
                  />
                  <div className="flex min-w-0 flex-col">
                    <span className="text-base text-stone-900">{opt}</span>
                    {i === 0 && (
                      <span className="mt-1 text-sm text-stone-500">{MOST_POPULAR_SUBTEXT}</span>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="sr-only">Select dessert, required, one option</legend>
            <p className="text-base font-semibold text-stone-900">Select dessert:</p>
            <RequiredOptionMeta />
            <div className="mt-2 flex w-full flex-col">
              {BOXED_DESSERT_CHOICES.map((opt, i) => (
                <label
                  key={opt.id}
                  className={`flex w-full cursor-pointer flex-row items-start gap-3 py-4 ${
                    i < BOXED_DESSERT_CHOICES.length - 1 ? 'border-b border-stone-200' : ''
                  }`}
                >
                  <input
                    type="radio"
                    className="mt-1 size-4 shrink-0 border-stone-300 text-emerald-700 focus:ring-emerald-600"
                    name={dessertGroupName}
                    checked={selectedDessertId === opt.id}
                    onChange={() => setSelectedDessertId(opt.id)}
                  />
                  <div className="flex min-w-0 flex-col">
                    <span className="text-base text-stone-900">{opt.label}</span>
                    {i === 0 && (
                      <span className="mt-1 text-sm text-stone-500">{MOST_POPULAR_SUBTEXT}</span>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </fieldset>

          <section className="mt-6">
            <label className="text-sm font-semibold text-stone-900" htmlFor={`box-name-${item.id}`}>
              {namingIsBatch ? (
                <>
                  Label this batch <span className="font-normal text-stone-500">(optional)</span>
                </>
              ) : (
                <>
                  Name on box <span className="font-normal text-stone-500">(optional)</span>
                </>
              )}
            </label>
            <input
              id={`box-name-${item.id}`}
              value={boxName}
              onChange={(e) => setBoxName(e.target.value)}
              placeholder={
                namingIsBatch
                  ? 'e.g. Marketing Team or Board Meeting'
                  : 'e.g. John — Finance'
              }
              className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/15"
            />
          </section>

          <section className="mt-6">
            <label className="text-sm font-semibold text-stone-900" htmlFor={`spl-${item.id}`}>
              Add special instructions
            </label>
            <textarea
              id={`spl-${item.id}`}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={3}
              placeholder="e.g. 1 box no tomatoes, allergies, drop-off notes…"
              className="mt-2 w-full resize-y rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/15"
            />
          </section>
        </div>

        <div className="shrink-0 border-t border-stone-200 bg-white px-5 py-4 shadow-[0_-10px_30px_rgba(0,0,0,0.06)]">
          <button
            type="button"
            disabled={!isValidQuantity}
            className={`w-full rounded-full py-3.5 text-sm font-semibold shadow-sm ${
              isValidQuantity
                ? 'bg-emerald-900 text-white hover:bg-emerald-950'
                : 'cursor-not-allowed bg-stone-200 text-stone-500'
            }`}
            onClick={() => {
              if (!isValidQuantity) return
              const qty = Math.min(999, Math.floor(Number(quantity)))
              addCartLine({
                menuItemId: item.id,
                qty,
                excluded: {},
                nameOnBox: boxName.trim() || undefined,
                boxedLunch: {
                  chips: selectedChips,
                  dessertSummary: dessertChoice.cartSummary,
                  dessertUpchargePerPerson: dessertChoice.upchargePerPerson,
                  specialInstructions: specialInstructions.trim() || undefined,
                },
              })
              onClose()
            }}
          >
            {footerCta}
          </button>
        </div>
      </div>
    </div>
  )
}

export function BoxedLunchCustomizeModal({ item, onClose }: Props) {
  if (item.id === BOXED_GF_CUSTOM_ITEM_ID) {
    return <GfCustomBoxedLunchModal item={item} onClose={onClose} />
  }
  return <StandardBoxedLunchCustomizeModal item={item} onClose={onClose} />
}
