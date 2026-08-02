import { ShoppingBag, Settings, Gem } from 'lucide-react'

export default function Header({ storeName, view, setView }) {
  const isShop = view === 'shop'

  return (
    <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5">
        <button onClick={() => setView('shop')} className="flex min-w-0 items-center gap-2.5 transition hover:opacity-80">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 shadow-sm">
            <Gem className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-gray-900 sm:text-xl">
              {storeName || 'Dippu Collection'}
            </h1>
          </div>
        </button>
        <button
          onClick={() => setView(isShop ? 'admin' : 'shop')}
          className="flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          {isShop ? (
            <>
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Store</span>
            </>
          )}
        </button>
      </div>
    </header>
  )
}
