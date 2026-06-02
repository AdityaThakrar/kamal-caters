import { useEffect, useId, useRef, useState } from 'react'

import { TAX_DISCLAIMER_DETAIL, TAX_LINE_HELP_TOOLTIP } from '../lib/tax'

type Variant = 'cart' | 'payment'

interface Props {
  variant?: Variant
}

export function TaxHelpLabel({ variant = 'cart' }: Props) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLSpanElement>(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) return
    const onDocMouseDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const btnSurface =
    variant === 'payment'
      ? 'border-stone-300 text-stone-500 hover:bg-stone-200 hover:text-stone-700'
      : 'border-stone-300 text-stone-500 hover:bg-stone-100 hover:text-stone-700'

  return (
    <span ref={rootRef} className="relative inline-flex items-center gap-1">
      <span>Tax</span>
      <button
        type="button"
        className={`inline-flex size-6 shrink-0 items-center justify-center rounded-full border bg-white text-[11px] font-bold leading-none shadow-sm transition ${btnSurface}`}
        title={TAX_LINE_HELP_TOOLTIP}
        aria-label="Which items are taxed?"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        ?
      </button>
      {open && (
        <div
          id={panelId}
          role="region"
          aria-label="Tax disclaimer"
          className="absolute left-0 top-[calc(100%+8px)] z-40 w-64 max-w-[min(18rem,calc(100vw-2.5rem))] rounded-lg border border-stone-200 bg-white p-3 text-left text-xs leading-snug text-stone-700 shadow-lg ring-1 ring-stone-900/5"
        >
          {TAX_DISCLAIMER_DETAIL}
        </div>
      )}
    </span>
  )
}
