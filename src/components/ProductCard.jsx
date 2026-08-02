import { MessageCircle } from 'lucide-react'
import { allImages } from '../utils/driveImage'

export default function ProductCard({ product, currency, onOrder, onPreview }) {
  const { name, description, price, images, image, category } = product
  const imgs = allImages(images || image)
  const thumb = imgs[0] || ''

  return (
    <div
      onClick={() => onPreview(product)}
      className="group cursor-pointer flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {thumb ? (
          <img
            src={thumb}
            alt={name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">No image</div>
        )}

        {imgs.length > 1 && (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
            {imgs.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 w-1.5 rounded-full ${idx === 0 ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}

        {category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-gray-700 shadow">
            {category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold leading-tight text-gray-900">{name}</h3>
          <span className="shrink-0 text-lg font-bold text-whatsapp-dark">
            {currency}{Number(price).toFixed(2)}
          </span>
        </div>
        <p className="line-clamp-2 flex-1 text-sm text-gray-500">{description}</p>
        <button
          onClick={(e) => { e.stopPropagation(); onOrder(product) }}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-whatsapp py-2.5 font-semibold text-white shadow-sm transition hover:bg-green-600"
        >
          <MessageCircle className="h-5 w-5" />
          Order on WhatsApp
        </button>
      </div>
    </div>
  )
}
