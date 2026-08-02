import { useState, useEffect, useRef } from 'react'
import { X, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { allImages } from '../utils/driveImage'

const SLIDE_INTERVAL = 2500
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[90dvh] overflow-y-auto overflow-x-hidden rounded-2xl bg-white shadow-2xl"
        style={{ animation: 'fadeInScale 200ms ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-1.5 shadow transition hover:bg-white"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-700" />
        </button>

        {/* Image slideshow */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
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

          {/* Arrows */}
          {imgs.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow transition hover:bg-white"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow transition hover:bg-white"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {imgs.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goTo(idx)}
                    className="h-2.5 w-2.5 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: idx === activeIdx ? '#fff' : 'rgba(255,255,255,0.45)',
                      transform: idx === activeIdx ? 'scale(1.3)' : 'scale(1)',
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Product info */}
        <div className="p-4 sm:p-5">
          <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
            <h3 className="text-lg font-bold text-gray-900 sm:text-xl">{product.name}</h3>
            <span className="shrink-0 text-lg font-bold text-whatsapp-dark sm:text-xl">
              {currency}{Number(product.price).toFixed(2)}
            </span>
          </div>

          {product.description && (
            <p className="mb-3 text-sm leading-relaxed text-gray-500">{product.description}</p>
          )}

          {product.category && (
            <span className="mb-4 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {product.category}
            </span>
          )}

          <button
            onClick={() => { onOrder(product); onClose() }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-whatsapp py-3 text-base font-semibold text-white shadow-sm transition hover:bg-green-600"
          >
            <MessageCircle className="h-5 w-5" />
            Order on WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}
