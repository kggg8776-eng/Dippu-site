import { useState } from 'react'
import { X, MessageCircle } from 'lucide-react'
import { buildWhatsAppUrl } from '../utils/whatsapp'
import { primaryImage } from '../utils/driveImage'

export default function OrderModal({ product, currency, settings, onClose }) {
  const thumb = primaryImage(product.images || product.image)
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')

  const total = (Number(product.price || 0) * Number(quantity || 1)).toFixed(2)

  const handleSubmit = (e) => {
    e.preventDefault()
    const url = buildWhatsAppUrl(settings.phoneNumber, { product, quantity, name, notes, currency })
    if (!url) {
      alert('The seller has not set a WhatsApp number yet. Please ask them to configure it in Admin.')
      return
    }
    window.open(url, '_blank')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-2xl bg-white p-5 sm:p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Place order</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-5 flex gap-4">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
            {thumb ? (
              <img src={thumb} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">No image</div>
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{product.name}</p>
            <p className="text-sm text-gray-500">
              {currency}{Number(product.price).toFixed(2)} each
            </p>
            <p className="mt-1 text-sm font-medium text-whatsapp-dark">
              Total: {currency}{total}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Your name *</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-whatsapp focus:ring-2 focus:ring-whatsapp/20"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity *</label>
            <input
              type="number"
              min={1}
              max={product.stock || 99}
              required
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-whatsapp focus:ring-2 focus:ring-whatsapp/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-whatsapp focus:ring-2 focus:ring-whatsapp/20"
              placeholder="Size, color, delivery instructions..."
            />
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-whatsapp py-2.5 font-semibold text-white shadow-sm transition hover:bg-green-600"
          >
            <MessageCircle className="h-5 w-5" />
            Continue to WhatsApp
          </button>
        </form>
      </div>
    </div>
  )
}
