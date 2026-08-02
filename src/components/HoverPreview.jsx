import { useState, useEffect, useRef } from 'react'
import { X, MessageCircle, ChevronLeft, ChevronRight, Share2, Heart } from 'lucide-react'
import { allImages } from '../utils/driveImage'

const SLIDE_INTERVAL = 3000
const TRANSITION_MS = 700

export default function ProductModal({ product, currency, onOrder, onClose }) {
  const imgs = allImages(product.images || product.image)
  const [activeIdx, setActiveIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef(null)

  // Auto-scroll
  useEffect(() => {
    if (imgs.length <= 1 || paused) return
    timerRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % imgs.length)
    }, SLIDE_INTERVAL)
    return () => clearInterval(timerRef.current)
  }, [imgs.length, paused])

  const goTo = (idx) => {
    setActiveIdx(idx)
    setPaused(true)
    setTimeout(() => setPaused(false), 4000)
  }
  const prev = () => goTo(activeIdx === 0 ? imgs.length - 1 : activeIdx - 1)
  const next = () => goTo(activeIdx === imgs.length - 1 ? 0 : activeIdx + 1)

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92dvh] overflow-hidden rounded-3xl bg-white shadow-2xl"
        style={{ animation: 'fadeInScale 250ms ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col lg:flex-row lg:h-[85vh] lg:max-h-[700px]">
          {/* Left — Image gallery */}
          <div className="relative aspect-square w-full overflow-hidden bg-gray-100 lg:aspect-auto lg:h-full lg:w-[55%]">
            {imgs.length > 0 ? (
              imgs.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`${product.name} ${idx + 1}`}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{
                    opacity: idx === activeIdx ? 1 : 0,
                    transition: `opacity ${TRANSITION_MS}ms ease-in-out`,
                  }}
                />
              ))
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                No images
              </div>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Arrows */}
            {imgs.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg transition hover:bg-white"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-800" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg transition hover:bg-white"
                >
                  <ChevronRight className="h-5 w-5 text-gray-800" />
                </button>
              </>
            )}

            {/* Thumbnail strip */}
            {imgs.length > 1 && (
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/30 px-3 py-2 backdrop-blur-sm">
                {imgs.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => goTo(idx)}
                    className={`h-10 w-10 overflow-hidden rounded-lg border-2 transition-all ${
                      idx === activeIdx ? 'border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Product details */}
          <div className="flex flex-1 flex-col overflow-y-auto p-5 sm:p-7 lg:p-8">
            {product.category && (
              <span className="mb-3 inline-flex w-fit items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
                {product.category}
              </span>
            )}

            <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">{product.name}</h3>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-gray-900">
                {currency}{Number(product.price).toFixed(0)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                {currency}{(Number(product.price) * 1.3).toFixed(0)}
              </span>
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                30% OFF
              </span>
            </div>

            {product.description && (
              <div className="mt-5">
                <h4 className="text-sm font-semibold text-gray-700">Description</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{product.description}</p>
              </div>
            )}

            {product.stock && (
              <p className="mt-4 text-xs text-gray-400">
                {product.stock > 5
                  ? <span className="text-green-600 font-medium">In Stock</span>
                  : <span className="text-amber-600 font-medium">Only {product.stock} left!</span>
                }
              </p>
            )}

            <div className="mt-auto pt-6">
              <button
                onClick={() => { onOrder(product); onClose() }}
                className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-whatsapp py-4 text-base font-bold text-white shadow-md shadow-green-500/20 transition hover:bg-green-600 hover:shadow-lg active:scale-[0.98]"
              >
                <MessageCircle className="h-5 w-5" />
                Order on WhatsApp
              </button>

              <div className="mt-3 flex gap-2">
                <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-gray-200 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
                  <Heart className="h-4 w-4" />
                  Wishlist
                </button>
                <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-gray-200 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
