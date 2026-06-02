import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  fourteenQuickPickDates,
  formatDateKey,
  formatDateLabel,
  getCateringTimeSlots,
  getCurrentDateTime,
  getEarliestReservationInstant,
  isBookingSelectionValid,
  isSlotAllowedForBooking,
  minDateKeyForLaterPicker,
  parseDateKey,
  startOfLocalDay,
} from '../lib/datetime'
import { isDeliveryAddressValid, isPickupZipValid, kitchenShortName } from '../lib/addressValidation'
import { geocodeStreetAddress, geocodeUsZip } from '../lib/geocode'
import { pickNearestStore } from '../lib/nearestStore'
import { storeById } from '../data/storeLocations'
import { Calendar } from '../components/ui/Calendar'
import { useCateringStore } from '../store/cateringStore'

const RUSH_PHONE_DISPLAY = '408-930-5343'
const RUSH_PHONE_TEL = 'tel:+14089305343'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1481070555726-e2fe83477d4a?auto=format&fit=crop&w=2000&q=80'

/** Clearbit logo lookup — swap for a hosted asset when available. */
const BRAND_LOGO_URL = 'https://logo.clearbit.com/eriksdelicafe.com'

type GeoStatus = 'idle' | 'loading' | 'ok' | 'error'

export function OnboardingPage() {
  const orderType = useCateringStore((s) => s.orderType)
  const setOrderType = useCateringStore((s) => s.setOrderType)
  const deliveryLine1 = useCateringStore((s) => s.deliveryLine1)
  const deliveryCity = useCateringStore((s) => s.deliveryCity)
  const deliveryState = useCateringStore((s) => s.deliveryState)
  const deliveryZip = useCateringStore((s) => s.deliveryZip)
  const setDeliveryFields = useCateringStore((s) => s.setDeliveryFields)
  const zipCode = useCateringStore((s) => s.zipCode)
  const setZipCode = useCateringStore((s) => s.setZipCode)
  const selectedStoreId = useCateringStore((s) => s.selectedStoreId)
  const assignStoreFromRouting = useCateringStore((s) => s.assignStoreFromRouting)
  const clearStoreAssignment = useCateringStore((s) => s.clearStoreAssignment)
  const selectedDateKey = useCateringStore((s) => s.selectedDateKey)
  const setSelectedDateKey = useCateringStore((s) => s.setSelectedDateKey)
  const selectedTimeWindow = useCateringStore((s) => s.selectedTimeWindow)
  const setSelectedTimeWindow = useCateringStore((s) => s.setSelectedTimeWindow)
  const headcount = useCateringStore((s) => s.headcount)
  const setHeadcount = useCateringStore((s) => s.setHeadcount)
  const onboardingValid = useCateringStore((s) => s.onboardingValid)

  const [deliveryGeo, setDeliveryGeo] = useState<GeoStatus>('idle')
  const [deliveryGeoMessage, setDeliveryGeoMessage] = useState('')
  const [pickupGeo, setPickupGeo] = useState<GeoStatus>('idle')

  const [clock, setClock] = useState(() => getCurrentDateTime())
  const [laterCalendarOpen, setLaterCalendarOpen] = useState(false)
  const laterPopoverRef = useRef<HTMLDivElement>(null)

  const earliest = useMemo(() => getEarliestReservationInstant(clock), [clock])
  const quickPickDates = useMemo(() => fourteenQuickPickDates(earliest), [earliest])
  const laterMinKey = useMemo(() => minDateKeyForLaterPicker(earliest), [earliest])
  const minSelectableLaterDate = useMemo(() => {
    const fromLater = parseDateKey(laterMinKey)
    const fromLead = startOfLocalDay(earliest)
    return fromLater.getTime() >= fromLead.getTime() ? fromLater : fromLead
  }, [laterMinKey, earliest])

  const laterCalendarSelected = useMemo(() => {
    if (!selectedDateKey) return undefined
    const d = parseDateKey(selectedDateKey)
    return d.getTime() >= minSelectableLaterDate.getTime() ? d : undefined
  }, [selectedDateKey, minSelectableLaterDate])

  const laterCalendarDefaultMonth = useMemo(
    () => laterCalendarSelected ?? minSelectableLaterDate,
    [laterCalendarSelected, minSelectableLaterDate],
  )

  useEffect(() => {
    if (!laterCalendarOpen) return
    const close = (e: MouseEvent) => {
      if (!laterPopoverRef.current?.contains(e.target as Node)) {
        setLaterCalendarOpen(false)
      }
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [laterCalendarOpen])
  const timeSlots = useMemo(() => getCateringTimeSlots(), [])

  useEffect(() => {
    if (useCateringStore.getState().orderType === null) {
      useCateringStore.getState().setOrderType('pickup')
    }
  }, [])

  useEffect(() => {
    const tick = () => {
      const now = getCurrentDateTime()
      setClock(now)
      const { selectedDateKey, selectedTimeWindow, setSelectedTimeWindow } = useCateringStore.getState()
      if (
        selectedDateKey &&
        selectedTimeWindow &&
        !isBookingSelectionValid(selectedDateKey, selectedTimeWindow, now)
      ) {
        setSelectedTimeWindow(null)
      }
    }
    tick()
    const id = window.setInterval(tick, 30_000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (orderType !== 'delivery') {
      const resetId = window.setTimeout(() => {
        setDeliveryGeo('idle')
        setDeliveryGeoMessage('')
      }, 0)
      return () => window.clearTimeout(resetId)
    }
  }, [orderType])

  useEffect(() => {
    if (orderType !== 'pickup') {
      const resetId = window.setTimeout(() => setPickupGeo('idle'), 0)
      return () => window.clearTimeout(resetId)
    }
    const zip = zipCode.replace(/\D/g, '')
    if (zip.length !== 5) {
      setPickupGeo('idle')
      return
    }

    let cancelled = false
    setPickupGeo('loading')

    ;(async () => {
      try {
        const coords = await geocodeUsZip(zip)
        if (cancelled) return
        if (!coords) {
          setPickupGeo('error')
          clearStoreAssignment()
          return
        }
        const result = pickNearestStore(coords.lat, coords.lng)
        assignStoreFromRouting(result.chosen, result.summary)
        setPickupGeo('ok')
      } catch {
        if (!cancelled) {
          setPickupGeo('error')
          clearStoreAssignment()
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [orderType, zipCode, assignStoreFromRouting, clearStoreAssignment])

  async function handleDeliveryAssign() {
    setDeliveryGeo('loading')
    setDeliveryGeoMessage('Finding the closest kitchen to your delivery address…')
    try {
      let coords = await geocodeStreetAddress(
        deliveryLine1.trim(),
        deliveryCity.trim(),
        deliveryState.trim(),
        deliveryZip,
      )
      if (!coords) {
        coords = await geocodeUsZip(deliveryZip)
      }
      if (!coords) {
        setDeliveryGeo('error')
        setDeliveryGeoMessage(
          'We could not plot that address. Check the street, city, state, and ZIP — or try again.',
        )
        useCateringStore.getState().clearStoreAssignment()
        return
      }
      const result = pickNearestStore(coords.lat, coords.lng)
      assignStoreFromRouting(result.chosen, result.summary)
      setDeliveryGeo('ok')
      setDeliveryGeoMessage('Kitchen assigned from your delivery location.')
    } catch {
      setDeliveryGeo('error')
      setDeliveryGeoMessage('Network error. Please try again in a moment.')
      useCateringStore.getState().clearStoreAssignment()
    }
  }

  const deliveryFieldsReady = isDeliveryAddressValid({
    deliveryLine1,
    deliveryCity,
    deliveryState,
    deliveryZip,
  })

  const pickupZipReady = isPickupZipValid(zipCode)
  const pickupKitchen = selectedStoreId ? storeById(selectedStoreId) : null

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-stone-900 lg:flex-row">
      <div className="relative flex min-h-[42vh] w-full flex-col justify-center overflow-hidden bg-stone-900 p-12 lg:min-h-screen lg:w-1/2 lg:p-24">
        <img
          src={HERO_IMAGE}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" aria-hidden />
        <div className="relative z-10 max-w-xl">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)]">
            Corporate Catering
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-[2.75rem] lg:leading-[1.1]">
            Elevate Your Office Lunch.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/90">
            Fresh, corporate-ready catering prepared daily.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-1 items-center justify-center p-6 py-12 lg:w-1/2 lg:p-16">
        <div className="w-full max-w-md space-y-10 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <div className="flex justify-center lg:justify-start">
            <img
              src={BRAND_LOGO_URL}
              alt="Erik's DeliCafe"
              className="h-16 w-auto max-w-[220px] object-contain object-left"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-stone-900">Order type</h2>
            <p className="mt-1 text-sm text-stone-500">
              Delivery to your address, or pickup from your local deli.
            </p>
            <div
              className="mt-5 flex w-full rounded-full bg-stone-100 p-1 ring-1 ring-stone-200/90"
              role="group"
              aria-label="Order type"
            >
              {(['delivery', 'pickup'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setOrderType(t)}
                  className={`relative flex-1 rounded-full py-2.5 text-sm font-semibold transition ${
                    orderType === t
                      ? 'bg-emerald-900 text-white shadow-sm hover:bg-emerald-950'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t === 'delivery' ? 'Delivery' : 'Pickup'}
                </button>
              ))}
            </div>
          </div>

          {orderType === 'delivery' && (
            <div className="border-t border-stone-100 pt-10">
              <h2 className="text-lg font-semibold text-stone-900">Delivery address</h2>
              <p className="mt-1 text-sm text-stone-500">
                We route your order to the nearest kitchen once this address is confirmed.
              </p>
              <div className="mt-5 space-y-4">
                <label className="block text-sm font-medium text-stone-800">
                  Street address
                  <input
                    type="text"
                    autoComplete="street-address"
                    value={deliveryLine1}
                    onChange={(e) => setDeliveryFields({ deliveryLine1: e.target.value })}
                    placeholder="123 Main St, Suite 400"
                    className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-base outline-none transition focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/25"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-stone-800">
                    City
                    <input
                      type="text"
                      autoComplete="address-level2"
                      value={deliveryCity}
                      onChange={(e) =>
                        setDeliveryFields({
                          deliveryCity: e.target.value.replace(/[^A-Za-z\s.'-]/g, ''),
                        })
                      }
                      placeholder="San Jose"
                      className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-base outline-none focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/25"
                    />
                  </label>
                  <label className="block text-sm font-medium text-stone-800">
                    State
                    <input
                      type="text"
                      maxLength={2}
                      autoComplete="address-level1"
                      value={deliveryState}
                      onChange={(e) =>
                        setDeliveryFields({
                          deliveryState: e.target.value.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 2),
                        })
                      }
                      placeholder="CA"
                      className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-base outline-none focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/25"
                    />
                  </label>
                </div>
                <label className="block text-sm font-medium text-stone-800">
                  ZIP code
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={5}
                    value={deliveryZip}
                    onChange={(e) => setDeliveryFields({ deliveryZip: e.target.value })}
                    placeholder="95113"
                    className="mt-1.5 w-full max-w-xs rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-base outline-none focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/25"
                  />
                </label>
              </div>
              <button
                type="button"
                disabled={!deliveryFieldsReady || deliveryGeo === 'loading'}
                onClick={() => void handleDeliveryAssign()}
                className={`mt-5 w-full rounded-xl py-3 text-sm font-semibold transition ${
                  deliveryFieldsReady && deliveryGeo !== 'loading'
                    ? 'bg-emerald-900 text-white hover:bg-emerald-950'
                    : 'cursor-not-allowed bg-stone-200 text-stone-500'
                }`}
              >
                {deliveryGeo === 'loading' ? 'Finding nearest kitchen…' : 'Confirm address & route order'}
              </button>
              {deliveryGeo !== 'idle' && (
                <p
                  className={`mt-3 text-sm ${
                    deliveryGeo === 'error'
                      ? 'text-red-700'
                      : deliveryGeo === 'ok'
                        ? 'text-emerald-800'
                        : 'text-stone-600'
                  }`}
                >
                  {deliveryGeoMessage}
                </p>
              )}
            </div>
          )}

          {orderType === 'pickup' && (
            <div className="border-t border-stone-100 pt-10">
              <h2 className="text-lg font-semibold text-stone-900">Pickup location</h2>
              <p className="mt-1 text-sm text-stone-500">
                Enter your ZIP code and we&apos;ll assign the nearest Erik&apos;s DeliCafe kitchen.
              </p>
              <label className="mt-5 block text-sm font-medium text-stone-800">
                Pickup ZIP code
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={5}
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="95118"
                  className="mt-1.5 w-full max-w-xs rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-base outline-none focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/25"
                />
              </label>
              {pickupGeo === 'loading' && (
                <p className="mt-3 text-sm text-stone-600">Finding nearest kitchen…</p>
              )}
              {pickupGeo === 'error' && (
                <p className="mt-3 text-sm text-red-700">
                  We couldn&apos;t find that ZIP. Check the code and try again.
                </p>
              )}
              {pickupZipReady && pickupKitchen && pickupGeo === 'ok' && (
                <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900">
                  <p className="font-semibold">
                    Fulfilling from: Erik&apos;s DeliCafe — {kitchenShortName(pickupKitchen.title)}
                  </p>
                  <p className="mt-1">{pickupKitchen.address}</p>
                </div>
              )}
            </div>
          )}

          <div className="border-t border-stone-100 pt-10">
            <h2 className="text-lg font-semibold text-stone-900">Date &amp; arrival window</h2>
            <p className="mt-1 text-sm text-stone-500">
              Bookings open at least 24 hours ahead. Choose a 15-minute window between 10:00 AM and 6:00 PM.
            </p>

            <div className="mt-4 rounded-xl border border-emerald-200/90 bg-emerald-50/95 px-4 py-3 text-sm text-stone-900">
              <p className="font-semibold leading-snug">
                Need catering in less than 24 hours? Call or text{' '}
                <a href={RUSH_PHONE_TEL} className="whitespace-nowrap underline underline-offset-2">
                  {RUSH_PHONE_DISPLAY}
                </a>{' '}
                for a rush order.
              </p>
            </div>

            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Dates</p>
                <div className="mt-3 max-h-60 space-y-1 overflow-y-auto pr-1">
                  {quickPickDates.map((d) => {
                    const key = formatDateKey(d)
                    const selected = selectedDateKey === key
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setSelectedDateKey(key)
                          if (
                            selectedTimeWindow &&
                            !isBookingSelectionValid(key, selectedTimeWindow, clock)
                          ) {
                            setSelectedTimeWindow(null)
                          }
                        }}
                        className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                          selected
                            ? 'bg-emerald-900 text-white shadow-sm hover:bg-emerald-950'
                            : 'text-stone-800 hover:bg-stone-100'
                        }`}
                      >
                        {formatDateLabel(d)}
                      </button>
                    )
                  })}
                </div>
                <div ref={laterPopoverRef} className="relative mt-3">
                  <button
                    type="button"
                    aria-expanded={laterCalendarOpen}
                    aria-haspopup="dialog"
                    className={`w-full rounded-full border px-3 py-2 text-sm font-semibold transition ${
                      laterCalendarOpen
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
                        : 'border-stone-200 bg-white text-stone-800 hover:bg-stone-50'
                    }`}
                    onClick={() => setLaterCalendarOpen((o) => !o)}
                  >
                    Choose a later date
                  </button>
                  {laterCalendarOpen && (
                    <div className="absolute left-0 right-0 z-30 mt-2 rounded-xl border border-stone-200 bg-white p-4 shadow-lg sm:left-auto sm:right-0 sm:min-w-[min(100%,320px)]">
                      <Calendar
                        today={clock}
                        minDate={minSelectableLaterDate}
                        defaultMonth={laterCalendarDefaultMonth}
                        selected={laterCalendarSelected}
                        onSelect={(d) => {
                          setSelectedDateKey(formatDateKey(d))
                          setSelectedTimeWindow(null)
                          setLaterCalendarOpen(false)
                        }}
                      />
                    </div>
                  )}
                </div>
                {selectedDateKey &&
                  !quickPickDates.some((d) => formatDateKey(d) === selectedDateKey) && (
                    <p className="mt-2 text-center text-xs text-stone-500">
                      Selected: {formatDateLabel(parseDateKey(selectedDateKey))}
                    </p>
                  )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  Time windows
                </p>
                <div className="mt-3 max-h-60 space-y-1 overflow-y-auto pr-1">
                  {!selectedDateKey && (
                    <p className="py-6 text-center text-sm text-stone-500">Select a date first.</p>
                  )}
                  {selectedDateKey &&
                    timeSlots.map((slot) => {
                      const allowed = isSlotAllowedForBooking(selectedDateKey, slot, clock)
                      const selected = selectedTimeWindow === slot.label
                      return (
                        <button
                          key={slot.label}
                          type="button"
                          disabled={!allowed}
                          onClick={() => {
                            if (allowed) setSelectedTimeWindow(slot.label)
                          }}
                          className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                            !allowed
                              ? 'cursor-not-allowed text-stone-400'
                              : selected
                                ? 'bg-emerald-900 text-white shadow-sm hover:bg-emerald-950'
                                : 'text-stone-800 hover:bg-stone-100'
                          }`}
                        >
                          {slot.label}
                        </button>
                      )
                    })}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-100 pt-10">
            <h2 className="text-lg font-semibold text-stone-900">Guest count</h2>
            <p className="mt-1 text-sm text-stone-500">
              Approximate number of people you are feeding — we use this to size trays and packages.
            </p>
            <input
              type="number"
              min={1}
              step={1}
              value={headcount ?? ''}
              onChange={(e) => {
                const v = e.target.value
                if (v === '') {
                  setHeadcount(null)
                  return
                }
                const n = Number.parseInt(v, 10)
                setHeadcount(Number.isFinite(n) && n > 0 ? n : null)
              }}
              placeholder="e.g. 24"
              className="mt-4 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-base outline-none focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/25"
            />
          </div>

          {!onboardingValid() && (
            <p className="text-center text-sm text-stone-500">
              <span className="font-medium text-stone-700">Almost there:</span>{' '}
              {orderType === 'delivery'
                ? 'Confirm your delivery address, then pick date, time, and guest count.'
                : 'Enter your pickup ZIP to assign a kitchen, then pick date, time, and guest count.'}
            </p>
          )}

          {onboardingValid() && (
            <p className="text-center text-sm font-medium text-emerald-800">You are set — open the menu.</p>
          )}

          <div className="border-t border-stone-100 pt-8">
            <Link
              to="/menu"
              aria-disabled={!onboardingValid()}
              className={`block w-full rounded-xl py-4 text-center text-lg font-semibold shadow-sm transition ${
                onboardingValid()
                  ? 'bg-emerald-900 text-white hover:bg-emerald-950'
                  : 'pointer-events-none cursor-not-allowed bg-stone-200 text-stone-500'
              }`}
            >
              Continue to menu
            </Link>
            <p className="mt-4 text-center text-xs text-stone-500">
              Continue as a guest — no sign-in required for this demo flow.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
