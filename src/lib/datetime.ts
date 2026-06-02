const MS_PER_DAY = 86_400_000

/** Strict 24-hour lead time from the current instant. */
export const BOOKING_LEAD_MS = MS_PER_DAY

export const CATERING_WINDOW_START_HOUR = 10
export const CATERING_WINDOW_END_HOUR = 18

function pad2(n: number): string {
  return n.toString().padStart(2, '0')
}

/** Real-time clock — call whenever you need “now” for booking rules. */
export function getCurrentDateTime(): Date {
  return new Date()
}

export function getEarliestReservationInstant(now: Date = getCurrentDateTime()): Date {
  return new Date(now.getTime() + BOOKING_LEAD_MS)
}

export function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function addLocalDays(base: Date, days: number): Date {
  return new Date(base.getFullYear(), base.getMonth(), base.getDate() + days)
}

export function formatDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

/** Display like "5/15 Friday" (M/D + weekday name). */
export function formatDateLabel(d: Date): string {
  const weekday = d.toLocaleDateString(undefined, { weekday: 'long' })
  return `${d.getMonth() + 1}/${d.getDate()} ${weekday}`
}

export function parseDateKey(key: string): Date {
  const [y, m, day] = key.split('-').map(Number)
  return new Date(y, m - 1, day)
}

export function nextNDays(n: number, from: Date = new Date()): Date[] {
  const out: Date[] = []
  const start = startOfLocalDay(from)
  for (let i = 0; i < n; i++) {
    out.push(addLocalDays(start, i))
  }
  return out
}

/** First calendar day shown in the quick-pick strip (local date of earliest reservation instant). */
export function getQuickPickFirstCalendarDay(earliestReservation: Date): Date {
  return startOfLocalDay(earliestReservation)
}

/** Exactly 14 consecutive calendar days starting from the first bookable calendar day. */
export function fourteenQuickPickDates(earliestReservation: Date): Date[] {
  const first = getQuickPickFirstCalendarDay(earliestReservation)
  return Array.from({ length: 14 }, (_, i) => addLocalDays(first, i))
}

/** Minimum `YYYY-MM-DD` for the “later” native date picker (day after the 14-day quick list). */
export function minDateKeyForLaterPicker(earliestReservation: Date): string {
  const first = getQuickPickFirstCalendarDay(earliestReservation)
  return formatDateKey(addLocalDays(first, 14))
}

export interface CateringTimeSlot {
  /** e.g. "10:00 AM – 10:15 AM" */
  label: string
  /** Minutes from local midnight at the start of the window. */
  startMinutesFromMidnight: number
}

function formatClock12(totalM: number): string {
  const h = Math.floor(totalM / 60)
  const m = totalM % 60
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = ((h + 11) % 12) + 1
  return `${h12}:${pad2(m)} ${ampm}`
}

/** 15-minute windows; last window ends at 6:00 PM. */
export function getCateringTimeSlots(): CateringTimeSlot[] {
  const toMinutes = (h: number, m: number) => h * 60 + m
  const START = toMinutes(CATERING_WINDOW_START_HOUR, 0)
  const END = toMinutes(CATERING_WINDOW_END_HOUR, 0)
  const slots: CateringTimeSlot[] = []
  for (let t = START; t + 15 <= END; t += 15) {
    slots.push({
      label: `${formatClock12(t)} – ${formatClock12(t + 15)}`,
      startMinutesFromMidnight: t,
    })
  }
  return slots
}

/** @deprecated Prefer `getCateringTimeSlots()` for booking logic. */
export function buildTimeWindows(): string[] {
  return getCateringTimeSlots().map((s) => s.label)
}

export function slotStartOnDateKey(dateKey: string, startMinutesFromMidnight: number): Date {
  const base = parseDateKey(dateKey)
  const h = Math.floor(startMinutesFromMidnight / 60)
  const m = startMinutesFromMidnight % 60
  base.setHours(h, m, 0, 0)
  return base
}

export function findSlotByLabel(label: string): CateringTimeSlot | undefined {
  return getCateringTimeSlots().find((s) => s.label === label)
}

export function isSlotAllowedForBooking(
  dateKey: string,
  slot: CateringTimeSlot,
  now: Date = getCurrentDateTime(),
): boolean {
  const earliest = getEarliestReservationInstant(now)
  const start = slotStartOnDateKey(dateKey, slot.startMinutesFromMidnight)
  return start.getTime() >= earliest.getTime()
}

export function isBookingSelectionValid(
  dateKey: string | null,
  timeWindowLabel: string | null,
  now: Date = getCurrentDateTime(),
): boolean {
  if (!dateKey || !timeWindowLabel) return false
  const slot = findSlotByLabel(timeWindowLabel)
  if (!slot) return false
  return isSlotAllowedForBooking(dateKey, slot, now)
}
