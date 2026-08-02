import { MessageCircle, Eye } from 'lucide-react'
import { allImages } from '../utils/driveImage'

export default function ProductCard({ product, currency, onOrder, onPreview }) {
  const { name, description, price, images, image, category } = product
  const imgs = allImages(images || image)
  const thumb = imgs[0] || ''

  return (
    <div
      onClick={() => onPreview(product)}
      className="group cursor-pointer flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        {thumb ? (
          <img
            src={thumb}
            alt={name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">No image</div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/20">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg transition duration-300 group-hover:opacity-100 group-hover:scale-100 scale-75">
            <Eye className="h-5 w-5 text-gray-800" />
          </div>
        </div>

        {imgs.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {imgs.map((_, idx) => (
              <span
                key={idx}
                className={`h-2 w-2 rounded-full shadow ${idx === 0 ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}

        {category && (
          <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="text-sm font-bold leading-snug text-gray-900 sm:text-base">{name}</h3>
        <p className="mt-0.5 line-clamp-2 flex-1 text-xs text-gray-500 sm:text-sm">{description}</p>

        <div className="mt-2 flex flex-col gap-2 sm:mt-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-base font-extrabold text-gray-900 sm:text-xl">
            {currency}{Number(price).toFixed(0)}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onOrder(product) }}
            className="flex w-full items-center justify-center gap-1.5 rounded-full bg-whatsapp px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-green-600 hover:shadow-md active:scale-95 sm:w-auto sm:px-4 sm:py-2 sm:text-sm"
          >
            <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Order
          </button>
        </div>
      </div>
    </div>
  )
}
