import { Gem, Shirt, Baby, LayoutGrid, Sparkles, PartyPopper } from 'lucide-react'

const CATEGORIES = ['All', 'Women', 'Men', 'Child', 'Jewellery', 'Festival']

const CATEGORY_META = {
  All: {
    icon: LayoutGrid,
    color: 'from-gray-700/80 to-gray-900/90',
    bg: 'bg-gradient-to-br from-gray-500 to-gray-700',
  },
  Women: {
    icon: Sparkles,
    color: 'from-rose-600/80 to-rose-900/90',
    bg: 'bg-gradient-to-br from-rose-400 to-rose-700',
  },
  Men: {
    icon: Shirt,
    color: 'from-blue-600/80 to-blue-900/90',
    bg: 'bg-gradient-to-br from-blue-400 to-blue-700',
  },
  Child: {
    icon: Baby,
    color: 'from-emerald-600/80 to-green-900/90',
    bg: 'bg-gradient-to-br from-emerald-400 to-green-700',
  },
  Jewellery: {
    icon: Gem,
    color: 'from-amber-600/80 to-yellow-900/90',
    bg: 'bg-gradient-to-br from-amber-400 to-yellow-700',
  },
  Festival: {
    icon: PartyPopper,
    color: 'from-red-600/80 to-orange-900/90',
    bg: 'bg-gradient-to-br from-red-400 to-orange-700',
  },
}

const DEFAULT_META = {
  icon: Sparkles,
  color: 'from-teal-600/80 to-teal-900/90',
  bg: 'bg-gradient-to-br from-teal-400 to-teal-700',
}

export default function CategorySection({ categories, selectedCategory, onSelect, productCounts }) {
  const ordered = [...new Set([...CATEGORIES, ...categories])]

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
      <div className="mb-6 text-center sm:mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">Collections</p>
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Shop by Category</h2>
        <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400" />
      </div>

      {/* Mobile: horizontal scroll. Desktop: grid */}
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-6 sm:gap-4 sm:overflow-visible sm:px-0 scrollbar-hide">
        {ordered.map((cat) => {
          const meta = CATEGORY_META[cat] || DEFAULT_META
          const Icon = meta.icon
          const isActive = selectedCategory === cat
          const count = productCounts[cat] || 0

          return (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              className={`group relative flex w-24 shrink-0 flex-col items-center justify-end overflow-hidden rounded-2xl pb-3 pt-8 transition-all duration-300 sm:w-auto sm:aspect-[4/3] ${
                meta.bg
              } ${
                isActive
                  ? 'ring-[3px] ring-amber-400 ring-offset-2 shadow-xl scale-[1.02]'
                  : 'shadow-md hover:shadow-xl hover:scale-[1.02]'
              }`}
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${meta.color}`} />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 shadow-sm backdrop-blur-sm sm:mb-3 sm:h-12 sm:w-12">
                  <Icon className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-sm font-bold text-white sm:text-base">{cat}</h3>
                <p className="text-[10px] text-white/80 sm:text-xs">
                  {count} {count === 1 ? 'item' : 'items'}
                </p>
              </div>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-amber-400 shadow-md sm:right-2.5 sm:top-2.5" />
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}
