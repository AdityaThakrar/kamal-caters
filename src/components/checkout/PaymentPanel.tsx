import { useEffect, useRef, useState } from 'react'

import { formatMoney } from '../../lib/money'
import { TaxHelpLabel } from '../TaxHelpLabel'
import { useCateringStore } from '../../store/cateringStore'

interface Props {
  onClose: () => void
  onHelcimSuccess: (payload: { orderNumber: string }) => void
}

function mockOrderNumber(): string {
  const n = Math.floor(100_000 + Math.random() * 900_000)
  return `ERIK-${n}`
}

export function PaymentPanel({ onClose, onHelcimSuccess }: Props) {
  const subtotal = useCateringStore((s) => s.subtotal)
  const taxAmount = useCateringStore((s) => s.taxAmount)
  const deliveryFee = useCateringStore((s) => s.deliveryFee)
  const tipAmount = useCateringStore((s) => s.tipAmount)
  const total = useCateringStore((s) => s.total)
  const paymentEmail = useCateringStore((s) => s.paymentEmail)
  const setPaymentEmail = useCateringStore((s) => s.setPaymentEmail)
  const clearCart = useCateringStore((s) => s.clearCart)

  const [cardName, setCardName] = useState('Jordan Lee')
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242')
  const [exp, setExp] = useState('08 / 29')
  const [cvv, setCvv] = useState('123')
  const [processing, setProcessing] = useState(false)

  const cancelledRef = useRef(false)
  useEffect(() => {
    return () => {
      cancelledRef.current = true
    }
  }, [])

  async function handleHelcimCheckout() {
    // TODO: HELCIM INTEGRATION
    // 1. Fetch a Checkout Token from our secure backend using the Helcim API.
    // 2. Pass the token to appendHelcimPayIframe(checkoutToken).
    // 3. Listen for the 'helcimPayResponse' window event to confirm payment before showing the Success screen.

    if (processing) return
    setProcessing(true)
    cancelledRef.current = false

    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 2500)
    })

    if (cancelledRef.current) {
      setProcessing(false)
      return
    }

    const orderNumber = mockOrderNumber()
    clearCart()
    setProcessing(false)
    onHelcimSuccess({ orderNumber })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl ring-1 ring-stone-200">
        <div className="flex items-start justify-between gap-3 border-b border-stone-100 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900">
              Payment
            </p>
            <h2 className="text-lg font-semibold text-stone-900">Card details (mock)</h2>
            <p className="mt-1 text-sm text-stone-600">
              HelcimPay.js will replace this flow — today we simulate the checkout round-trip only.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={processing}
            className="rounded-full p-2 text-stone-500 hover:bg-stone-100 disabled:pointer-events-none disabled:opacity-40"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          <fieldset disabled={processing} className="space-y-4">
            <legend className="sr-only">Payment details</legend>
            <label className="block text-sm font-medium text-stone-800">
              Confirmation email
              <input
                type="email"
                value={paymentEmail}
                onChange={(e) => setPaymentEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/20"
              />
            </label>
            <label className="block text-sm font-medium text-stone-800">
              Name on card
              <input
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/20"
              />
            </label>
            <label className="block text-sm font-medium text-stone-800">
              Card number
              <input
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/20"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-medium text-stone-800">
                Expiration
                <input
                  value={exp}
                  onChange={(e) => setExp(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/20"
                />
              </label>
              <label className="block text-sm font-medium text-stone-800">
                CVV
                <input
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/20"
                />
              </label>
            </div>
          </fieldset>
          <div className="space-y-1.5 rounded-xl bg-stone-50 px-3 py-3 text-sm text-stone-700 ring-1 ring-stone-200">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-stone-900">{formatMoney(subtotal())}</span>
            </div>
            <div className="flex justify-between">
              <TaxHelpLabel variant="payment" />
              <span className="text-stone-900">{formatMoney(taxAmount())}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery fee</span>
              <span className="text-stone-900">{formatMoney(deliveryFee())}</span>
            </div>
            <div className="flex justify-between">
              <span>Tip</span>
              <span className="text-stone-900">{formatMoney(tipAmount())}</span>
            </div>
            <div className="flex justify-between border-t border-stone-200 pt-2 font-semibold text-stone-900">
              <span>Due today</span>
              <span>{formatMoney(total())}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-100 px-5 py-4">
          <button
            type="button"
            disabled={processing}
            onClick={() => void handleHelcimCheckout()}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-900 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-950 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {processing && (
              <svg
                className="size-4 shrink-0 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {processing ? 'Processing...' : 'Place order'}
          </button>
        </div>
      </div>
    </div>
  )
}
