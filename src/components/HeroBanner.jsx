import { ShoppingBag } from 'lucide-react'

export default function HeroBanner({ storeName, onShopNow }) {
  return (
    <section className="relative overflow-hidden bg-[#1a0a0a]">
      {/* Background fashion image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a0a0a] via-[#1a0a0a]/80 to-transparent" />
      </div>

      {/* Gold accent line */}
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:flex lg:items-center lg:gap-16 lg:py-36">
        {/* Left content */}
        <div className="max-w-xl lg:flex-1">
          <div className="mb-5 inline-flex items-center gap-2 border border-amber-400/30 rounded-full px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-amber-300">New Arrivals 2026</span>
          </div>

          <h1 className="font-extrabold leading-[1.05] text-white" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
            Elegance in Every
            <span className="block bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
              {storeName || 'Stitch & Stone'}
            </span>
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-gray-300 sm:text-lg">
            Handpicked jewellery, designer sarees, kurtis & western wear — curated for the modern Indian woman.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onShopNow}
              className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 px-8 py-3.5 text-base font-bold text-gray-900 shadow-lg shadow-amber-500/20 transition hover:shadow-xl hover:shadow-amber-500/30 hover:scale-105 active:scale-95"
            >
              <ShoppingBag className="h-5 w-5 transition group-hover:rotate-[-8deg]" />
              Shop Now
            </button>
            <button
              onClick={onShopNow}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-base font-medium text-white transition hover:border-amber-400/40 hover:text-amber-300"
            >
              Explore Collections
            </button>
          </div>

          {/* Trust badge */}
          <div className="mt-10 flex items-center gap-2 text-xs text-gray-400">
            <span className="text-amber-400">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
            <span>Trusted by 1000+ customers</span>
          </div>
        </div>

        {/* Right side — fashion showcase */}
        <div className="mt-14 hidden lg:mt-0 lg:flex lg:flex-1 lg:justify-end">
          <div className="relative">
            {/* Main showcase image */}
            <div className="relative h-[420px] w-[320px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=640&q=80"
                alt="Fashion jewellery"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-xs font-medium uppercase tracking-wider text-amber-300">Trending Now</p>
                <p className="mt-1 text-lg font-bold text-white">Festive Collection</p>
              </div>
            </div>

            {/* Floating mini card */}
            <div className="absolute -left-12 bottom-16 h-28 w-28 overflow-hidden rounded-2xl border border-white/10 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=300&q=80"
                alt="Saree"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Price tag */}
            <div className="absolute -right-6 top-12 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md">
              <p className="text-xs text-gray-300">Starting from</p>
              <p className="text-xl font-bold text-amber-400">₹499</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom curve */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
          <path d="M0 50H1440V25C1440 25 1140 0 720 0C300 0 0 25 0 25V50Z" fill="#f9fafb" />
        </svg>
      </div>
    </section>
  )
}
