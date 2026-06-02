import { startOfDay } from 'date-fns'
import { DayPicker, getDefaultClassNames } from 'react-day-picker'
import type { Matcher } from 'react-day-picker'

const base = getDefaultClassNames()

export type CalendarProps = {
  /** Currently selected calendar day (local date). */
  selected?: Date
  /** Called with the clicked day when selection changes. */
  onSelect: (date: Date) => void
  /** Days before this calendar date (local midnight) are disabled. */
  minDate: Date
  /** Month shown when the calendar first opens. */
  defaultMonth?: Date
  /** “Today” marker for styling; defaults to real now if omitted. */
  today?: Date
  className?: string
}

export function Calendar({ selected, onSelect, minDate, defaultMonth, today, className }: CalendarProps) {
  const min = startOfDay(minDate)
  const disabled: Matcher = { before: min }

  return (
    <DayPicker
      mode="single"
      required={false}
      selected={selected ? startOfDay(selected) : undefined}
      disabled={disabled}
      defaultMonth={defaultMonth ? startOfDay(defaultMonth) : min}
      today={today}
      showOutsideDays
      className={['catering-calendar', className].filter(Boolean).join(' ')}
      classNames={{
        ...base,
        root: `${base.root} rounded-lg p-0`,
        months: `${base.months} gap-3`,
        month: `${base.month} space-y-2`,
        month_caption: `${base.month_caption} flex h-10 items-center justify-center px-10`,
        caption_label: `${base.caption_label} text-sm font-semibold text-stone-900`,
        nav: `${base.nav} items-center gap-1`,
        button_previous: `${base.button_previous} inline-flex size-9 items-center justify-center rounded-lg text-stone-500 transition-colors hover:bg-stone-100 hover:text-emerald-900`,
        button_next: `${base.button_next} inline-flex size-9 items-center justify-center rounded-lg text-stone-500 transition-colors hover:bg-stone-100 hover:text-emerald-900`,
        chevron: `${base.chevron} size-4`,
        weekdays: `${base.weekdays} px-0`,
        weekday: `${base.weekday} py-1 text-[11px] font-semibold uppercase tracking-wide text-stone-500`,
        week: `${base.week} mt-0.5`,
        day: `${base.day} p-0 text-center`,
        day_button: [
          base.day_button,
          'mx-auto size-9 rounded-full text-sm font-medium text-stone-800 transition-colors',
          'enabled:hover:bg-emerald-50 enabled:hover:text-emerald-900',
          'disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-stone-300',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-900 focus-visible:ring-offset-2',
          'disabled:focus-visible:ring-0 disabled:focus-visible:ring-offset-0',
        ].join(' '),
        outside: `${base.outside} text-stone-400`,
        disabled: `${base.disabled} text-stone-300`,
      }}
      onSelect={(d) => {
        if (d) onSelect(d)
      }}
    />
  )
}
