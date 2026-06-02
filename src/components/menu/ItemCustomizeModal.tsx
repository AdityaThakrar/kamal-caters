import { useState } from 'react'

import { formatMoney } from '../../lib/money'
import {
  DELUXE_CATERING_COOKIES,
  DELUXE_CATERING_SALADS,
  DELUXE_CHARACTER_TRAY_ITEM_ID,
  defaultDeluxeCateringCookies,
  defaultDeluxeCateringSalad,
  type DeluxeCateringCookiesValue,
  type DeluxeCateringSaladValue,
} from '../../lib/deluxeCharacterTray'
import {
  TRAY_SANDWICH_CONFIGURATIONS,
  defaultTraySandwichConfiguration,
  trayModalLineTotal,
  type TraySandwichConfigurationValue,
} from '../../lib/trayPackage'
import { INDIVIDUAL_SALADS_CATEGORY, CATERING_SALADS_SERVES_12_CATEGORY, SIDES_CATEGORY, DESSERTS_CATEGORY, BEVERAGES_CATEGORY } from '../../data/menuItems'
import type { ExcludableIngredient, MenuItem } from '../../types/menu'
import { EXCLUDABLE_INGREDIENTS, useCateringStore } from '../../store/cateringStore'
import { MenuItemTileImage } from './MenuItemTileImage'

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

function TrayCustomizeBody({ item, onClose }: Props) {
  const addCartLine = useCateringStore((s) => s.addCartLine)

  const isDeluxeCharacterTray = item.id === DELUXE_CHARACTER_TRAY_ITEM_ID

  const [quantity, setQuantity] = useState<string>('')
  const [trayConfiguration, setTrayConfiguration] = useState<TraySandwichConfigurationValue>(
    defaultTraySandwichConfiguration(),
  )
  const [selectedSalad, setSelectedSalad] = useState<DeluxeCateringSaladValue>(
    defaultDeluxeCateringSalad(),
  )
  const [selectedCookies, setSelectedCookies] = useState<DeluxeCateringCookiesValue>(
    defaultDeluxeCateringCookies(),
  )
  const [batchLabel, setBatchLabel] = useState('')
  const [specialInstructions, setSpecialInstructions] = useState('')

  const isValidQuantity = quantity !== '' && Number(quantity) > 0
  const showZeroQuantityError = quantity !== '' && Number(quantity) === 0

  const qtyParsedForNaming = quantity === '' ? NaN : Number(quantity)
  const namingIsBatch =
    Number.isFinite(qtyParsedForNaming) && qtyParsedForNaming > 1

  const displayQtyForFooter =
    quantity === ''
      ? 1
      : isValidQuantity
        ? Math.min(999, Math.floor(Number(quantity)))
        : 0

  const currentTotal = trayModalLineTotal(item, displayQtyForFooter)
  const footerCta = `Add to cart - ${formatMoney(currentTotal)}`

  const configGroupName = `tray-sandwich-config-${item.id}`
  const saladGroupName = `deluxe-salad-${item.id}`
  const cookiesGroupName = `deluxe-cookies-${item.id}`

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
            Catering package & sandwich tray
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-stone-900">{item.name}</h2>
          <p className="mt-2 text-sm font-semibold text-stone-900">
            {formatMoney(item.price)} <span className="font-normal text-stone-600">per tray</span>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.description}</p>

          <section className="mt-6">
            <label className="text-sm font-semibold text-stone-900" htmlFor={`tray-qty-${item.id}`}>
              Select quantity:
            </label>
            <p className="mt-1 text-xs text-stone-500">How many trays of this package you need.</p>
            <input
              id={`tray-qty-${item.id}`}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={3}
              placeholder="e.g. 2"
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
            <legend className="sr-only">Select sandwich configuration, required, one option</legend>
            <p className="text-base font-semibold text-stone-900">Select sandwich configuration:</p>
            <RequiredOptionMeta />
            <div className="mt-2 flex w-full flex-col">
              {TRAY_SANDWICH_CONFIGURATIONS.map((opt, i) => (
                <label
                  key={opt.value}
                  className={`flex w-full cursor-pointer flex-row items-start gap-3 py-4 ${
                    i < TRAY_SANDWICH_CONFIGURATIONS.length - 1 ? 'border-b border-stone-200' : ''
                  }`}
                >
                  <input
                    type="radio"
                    className="mt-1 size-4 shrink-0 border-stone-300 text-emerald-700 focus:ring-emerald-600"
                    name={configGroupName}
                    checked={trayConfiguration === opt.value}
                    onChange={() => setTrayConfiguration(opt.value)}
                  />
                  <div className="flex min-w-0 flex-col">
                    <span className="text-base text-stone-900">{opt.label}</span>
                    {'subtext' in opt && opt.subtext && (
                      <span className="mt-1 text-sm text-stone-500">{opt.subtext}</span>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </fieldset>

          {isDeluxeCharacterTray && (
            <fieldset className="mt-6">
              <legend className="sr-only">Select catering-sized salad, required, one option</legend>
              <p className="text-base font-semibold text-stone-900">Select catering-sized salad:</p>
              <RequiredOptionMeta />
              <div className="mt-2 flex w-full flex-col">
                {DELUXE_CATERING_SALADS.map((opt, i) => (
                  <label
                    key={opt.value}
                    className={`flex w-full cursor-pointer flex-row items-start gap-3 py-4 ${
                      i < DELUXE_CATERING_SALADS.length - 1 ? 'border-b border-stone-200' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      className="mt-1 size-4 shrink-0 border-stone-300 text-emerald-700 focus:ring-emerald-600"
                      name={saladGroupName}
                      checked={selectedSalad === opt.value}
                      onChange={() => setSelectedSalad(opt.value)}
                    />
                    <div className="flex min-w-0 flex-col">
                      <span className="text-base text-stone-900">{opt.label}</span>
                      {'subtext' in opt && opt.subtext && (
                        <span className="mt-1 text-sm text-stone-500">{opt.subtext}</span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {isDeluxeCharacterTray && (
            <fieldset className="mt-6">
              <legend className="sr-only">Select cookies one dozen, required, one option</legend>
              <p className="text-base font-semibold text-stone-900">Select cookies (1 dozen):</p>
              <RequiredOptionMeta />
              <div className="mt-2 flex w-full flex-col">
                {DELUXE_CATERING_COOKIES.map((opt, i) => (
                  <label
                    key={opt.value}
                    className={`flex w-full cursor-pointer flex-row items-start gap-3 py-4 ${
                      i < DELUXE_CATERING_COOKIES.length - 1 ? 'border-b border-stone-200' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      className="mt-1 size-4 shrink-0 border-stone-300 text-emerald-700 focus:ring-emerald-600"
                      name={cookiesGroupName}
                      checked={selectedCookies === opt.value}
                      onChange={() => setSelectedCookies(opt.value)}
                    />
                    <div className="flex min-w-0 flex-col">
                      <span className="text-base text-stone-900">{opt.label}</span>
                      {'subtext' in opt && opt.subtext && (
                        <span className="mt-1 text-sm text-stone-500">{opt.subtext}</span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <section className="mt-6">
            <label className="text-sm font-semibold text-stone-900" htmlFor={`tray-label-${item.id}`}>
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
              id={`tray-label-${item.id}`}
              value={batchLabel}
              onChange={(e) => setBatchLabel(e.target.value)}
              placeholder={
                namingIsBatch
                  ? 'e.g. Marketing Team or Board Meeting'
                  : 'e.g. John — Finance'
              }
              className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/15"
            />
          </section>

          <section className="mt-6">
            <label className="text-sm font-semibold text-stone-900" htmlFor={`tray-spl-${item.id}`}>
              Add special instructions
            </label>
            <textarea
              id={`tray-spl-${item.id}`}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={3}
              placeholder="e.g. cut sandwiches in half, allergies, drop-off notes…"
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
                nameOnBox: batchLabel.trim() || undefined,
                trayPackage: {
                  trayConfiguration,
                  ...(isDeluxeCharacterTray
                    ? { selectedSalad, selectedCookies }
                    : {}),
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

type SimpleLineModalCopy = {
  eyebrow: string
  priceSuffix: string
  quantityHelp: string
  qtyPlaceholder: string
  specialPlaceholder: string
}

function SimpleQuantityLabelInstructionsModal({
  item,
  onClose,
  copy,
}: Props & { copy: SimpleLineModalCopy }) {
  const addCartLine = useCateringStore((s) => s.addCartLine)

  const [quantity, setQuantity] = useState<string>('')
  const [batchLabel, setBatchLabel] = useState('')
  const [specialInstructions, setSpecialInstructions] = useState('')

  const isValidQuantity = quantity !== '' && Number(quantity) > 0
  const showZeroQuantityError = quantity !== '' && Number(quantity) === 0

  const qtyParsedForNaming = quantity === '' ? NaN : Number(quantity)
  const namingIsBatch =
    Number.isFinite(qtyParsedForNaming) && qtyParsedForNaming > 1

  const displayQtyForFooter =
    quantity === ''
      ? 1
      : isValidQuantity
        ? Math.min(999, Math.floor(Number(quantity)))
        : 0

  const currentTotal = trayModalLineTotal(item, displayQtyForFooter)
  const footerCta = `Add to cart - ${formatMoney(currentTotal)}`
  const fieldId = `simple-line-${item.id}`

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

          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">{copy.eyebrow}</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-stone-900">{item.name}</h2>
          <p className="mt-2 text-sm font-semibold text-stone-900">
            {formatMoney(item.price)}{' '}
            <span className="font-normal text-stone-600">{copy.priceSuffix}</span>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.description}</p>

          <section className="mt-6">
            <label className="text-sm font-semibold text-stone-900" htmlFor={`${fieldId}-qty`}>
              Select quantity:
            </label>
            <p className="mt-1 text-xs text-stone-500">{copy.quantityHelp}</p>
            <input
              id={`${fieldId}-qty`}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={3}
              placeholder={copy.qtyPlaceholder}
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

          <section className="mt-6">
            <label className="text-sm font-semibold text-stone-900" htmlFor={`${fieldId}-label`}>
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
              id={`${fieldId}-label`}
              value={batchLabel}
              onChange={(e) => setBatchLabel(e.target.value)}
              placeholder={
                namingIsBatch
                  ? 'e.g. Marketing Team or Board Meeting'
                  : 'e.g. John — Finance'
              }
              className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/15"
            />
          </section>

          <section className="mt-6">
            <label className="text-sm font-semibold text-stone-900" htmlFor={`${fieldId}-spl`}>
              Add special instructions
            </label>
            <textarea
              id={`${fieldId}-spl`}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={3}
              placeholder={copy.specialPlaceholder}
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
                nameOnBox: batchLabel.trim() || undefined,
                specialInstructions: specialInstructions.trim() || undefined,
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

function IndividualSaladCustomizeBody(props: Props) {
  return (
    <SimpleQuantityLabelInstructionsModal
      {...props}
      copy={{
        eyebrow: 'Individual salad',
        priceSuffix: 'each',
        quantityHelp: 'How many salads you need.',
        qtyPlaceholder: 'e.g. 5',
        specialPlaceholder: 'e.g. no tomatoes, dressing on the side...',
      }}
    />
  )
}

function CateringSaladTrayBody(props: Props) {
  return (
    <SimpleQuantityLabelInstructionsModal
      {...props}
      copy={{
        eyebrow: 'Catering salad (serves 12)',
        priceSuffix: 'per bowl (serves 12)',
        quantityHelp: 'How many catering bowls you need.',
        qtyPlaceholder: 'e.g. 2',
        specialPlaceholder: 'e.g. dressing on the side, no croutons...',
      }}
    />
  )
}

function SidesBareModalBody({ item, onClose }: Props) {
  const addCartLine = useCateringStore((s) => s.addCartLine)

  const [quantity, setQuantity] = useState<string>('')

  const isValidQuantity = quantity !== '' && Number(quantity) > 0
  const showZeroQuantityError = quantity !== '' && Number(quantity) === 0

  const displayQtyForFooter =
    quantity === ''
      ? 1
      : isValidQuantity
        ? Math.min(999, Math.floor(Number(quantity)))
        : 0

  const currentTotal = trayModalLineTotal(item, displayQtyForFooter)
  const footerCta = `Add to cart - ${formatMoney(currentTotal)}`
  const fieldId = `side-only-${item.id}`

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

          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Side</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-stone-900">{item.name}</h2>
          <p className="mt-2 text-sm font-semibold text-stone-900">{formatMoney(item.price)}</p>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.description}</p>

          <section className="mt-6">
            <label className="text-sm font-semibold text-stone-900" htmlFor={`${fieldId}-qty`}>
              Select quantity:
            </label>
            <p className="mt-1 text-xs text-stone-500">How many you need.</p>
            <input
              id={`${fieldId}-qty`}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={3}
              placeholder="e.g. 4"
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

function DessertsBareModalBody({ item, onClose }: Props) {
  const addCartLine = useCateringStore((s) => s.addCartLine)

  const [quantity, setQuantity] = useState<string>('')

  const isValidQuantity = quantity !== '' && Number(quantity) > 0
  const showZeroQuantityError = quantity !== '' && Number(quantity) === 0

  const displayQtyForFooter =
    quantity === ''
      ? 1
      : isValidQuantity
        ? Math.min(999, Math.floor(Number(quantity)))
        : 0

  const currentTotal = trayModalLineTotal(item, displayQtyForFooter)
  const footerCta = `Add to cart - ${formatMoney(currentTotal)}`
  const fieldId = `dessert-only-${item.id}`

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

          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Dessert</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-stone-900">{item.name}</h2>
          <p className="mt-2 text-sm font-semibold text-stone-900">{formatMoney(item.price)}</p>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.description}</p>

          <section className="mt-6">
            <label className="text-sm font-semibold text-stone-900" htmlFor={`${fieldId}-qty`}>
              Select quantity:
            </label>
            <p className="mt-1 text-xs text-stone-500">How many you need.</p>
            <input
              id={`${fieldId}-qty`}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={3}
              placeholder="e.g. 3"
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

function BeveragesBareModalBody({ item, onClose }: Props) {
  const addCartLine = useCateringStore((s) => s.addCartLine)

  const [quantity, setQuantity] = useState<string>('')

  const isValidQuantity = quantity !== '' && Number(quantity) > 0
  const showZeroQuantityError = quantity !== '' && Number(quantity) === 0

  const displayQtyForFooter =
    quantity === ''
      ? 1
      : isValidQuantity
        ? Math.min(999, Math.floor(Number(quantity)))
        : 0

  const currentTotal = trayModalLineTotal(item, displayQtyForFooter)
  const footerCta = `Add to cart - ${formatMoney(currentTotal)}`
  const fieldId = `beverage-only-${item.id}`

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

          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Beverage</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-stone-900">{item.name}</h2>
          <p className="mt-2 text-sm font-semibold text-stone-900">{formatMoney(item.price)}</p>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.description}</p>

          <section className="mt-6">
            <label className="text-sm font-semibold text-stone-900" htmlFor={`${fieldId}-qty`}>
              Select quantity:
            </label>
            <p className="mt-1 text-xs text-stone-500">How many you need.</p>
            <input
              id={`${fieldId}-qty`}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={3}
              placeholder="e.g. 12"
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

function IndividualCustomizeBody({ item, onClose }: Props) {
  const addCartLine = useCateringStore((s) => s.addCartLine)
  const [excluded, setExcluded] = useState<Partial<Record<ExcludableIngredient, boolean>>>({})
  const [nameOnBox, setNameOnBox] = useState('')

  const toggle = (ing: ExcludableIngredient) => {
    setExcluded((prev) => ({
      ...prev,
      [ing]: !prev[ing],
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/50 p-0 sm:items-center sm:p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white shadow-2xl ring-1 ring-stone-200 sm:rounded-2xl">
        <div className="px-5 pt-4">
          <MenuItemTileImage item={item} className="max-h-48" />
        </div>
        <div className="flex items-start justify-between gap-3 border-b border-stone-100 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Customize</p>
            <h2 className="text-lg font-semibold text-stone-900">{item.name}</h2>
            <p className="mt-1 text-sm text-stone-600">{item.description}</p>
            <p className="mt-2 text-base font-bold text-stone-900">{formatMoney(item.price)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-800"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5 px-5 py-4">
          <section>
            <h3 className="text-sm font-semibold text-stone-900">Hold ingredients</h3>
            <p className="mt-1 text-xs text-stone-600">
              Check an ingredient to exclude it — we&apos;ll label it clearly as &quot;No …&quot;.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {EXCLUDABLE_INGREDIENTS.map((ing) => {
                const isOut = Boolean(excluded[ing])
                return (
                  <label
                    key={ing}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                      isOut
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-950'
                        : 'border-stone-200 bg-stone-50 text-stone-800 hover:border-stone-300'
                    }`}
                  >
                    <input type="checkbox" checked={isOut} onChange={() => toggle(ing)} />
                    <span className={isOut ? 'line-through decoration-2' : ''}>{ing}</span>
                    {isOut && (
                      <span className="ml-auto text-xs font-semibold text-emerald-900">No {ing}</span>
                    )}
                  </label>
                )
              })}
            </div>
          </section>

          <section>
            <label className="text-sm font-semibold text-stone-900" htmlFor={`name-on-box-${item.id}`}>
              Name on box <span className="font-normal text-stone-500">(optional)</span>
            </label>
            <input
              id={`name-on-box-${item.id}`}
              value={nameOnBox}
              onChange={(e) => setNameOnBox(e.target.value)}
              placeholder="e.g. Aisha — Finance"
              className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none ring-emerald-500/0 focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/15"
            />
          </section>
        </div>

        <div className="sticky bottom-0 border-t border-stone-100 bg-white/95 px-5 py-4 backdrop-blur">
          <button
            type="button"
            className="w-full rounded-full bg-stone-900 py-3 text-sm font-semibold text-white shadow-sm hover:bg-stone-800"
            onClick={() => {
              addCartLine({
                menuItemId: item.id,
                qty: 1,
                excluded,
                nameOnBox: nameOnBox.trim() || undefined,
              })
              onClose()
            }}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  )
}

export function ItemCustomizeModal({ item, onClose }: Props) {
  if (item.category === CATERING_SALADS_SERVES_12_CATEGORY) {
    return <CateringSaladTrayBody item={item} onClose={onClose} />
  }
  if (item.category === SIDES_CATEGORY) {
    return <SidesBareModalBody item={item} onClose={onClose} />
  }
  if (item.category === DESSERTS_CATEGORY) {
    return <DessertsBareModalBody item={item} onClose={onClose} />
  }
  if (item.category === BEVERAGES_CATEGORY) {
    return <BeveragesBareModalBody item={item} onClose={onClose} />
  }
  if (item.packaging_type === 'Tray') {
    return <TrayCustomizeBody item={item} onClose={onClose} />
  }
  if (item.category === INDIVIDUAL_SALADS_CATEGORY) {
    return <IndividualSaladCustomizeBody item={item} onClose={onClose} />
  }
  return <IndividualCustomizeBody item={item} onClose={onClose} />
}
