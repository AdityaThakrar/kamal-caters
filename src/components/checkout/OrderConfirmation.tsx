interface Props {
  orderNumber: string
  confirmationEmail: string
  onReturnToMenu: () => void
}

export function OrderConfirmation({ orderNumber, confirmationEmail, onReturnToMenu }: Props) {
  const displayRef = orderNumber.startsWith('#') ? orderNumber : `#${orderNumber}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-stone-200">
        <div className="flex justify-center">
          <div
            className="flex size-16 items-center justify-center rounded-full bg-emerald-100 ring-4 ring-emerald-200/60"
            aria-hidden
          >
            <svg
              className="size-9 text-emerald-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
        </div>

        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-stone-900">
          Order Confirmed!
        </h2>

        <p className="mt-3 text-center text-sm leading-relaxed text-stone-600">
          Thank you! Your catering order has been received. A receipt has been sent to your email.
        </p>

        <p className="mt-2 text-center text-xs text-stone-500">
          Sent to <span className="font-medium text-stone-800">{confirmationEmail}</span>
        </p>

        <div className="mt-6 rounded-xl bg-stone-50 px-4 py-3 text-center ring-1 ring-stone-200">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Order number</p>
          <p className="mt-1 font-mono text-lg font-semibold text-stone-900">{displayRef}</p>
        </div>

        <button
          type="button"
          className="mt-8 w-full rounded-full bg-emerald-900 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-950"
          onClick={onReturnToMenu}
        >
          Return to Menu
        </button>
      </div>
    </div>
  )
}
