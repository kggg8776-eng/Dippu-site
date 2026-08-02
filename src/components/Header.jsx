import { Store, ShoppingBag, Settings } from 'lucide-react'

export default function Header({ storeName, view, setView }) {
  const isShop = view === 'shop'

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex min-w-0 items-center gap-2">
          <Store className="h-6 w-6 shrink-0 text-whatsapp-dark sm:h-7 sm:w-7" />
          <h1 className="truncate text-lg font-bold text-gray-900 sm:text-2xl">
            {storeName || 'My WhatsApp Shop'}
          </h1>
        </div>
        <button
          onClick={() => setView(isShop ? 'admin' : 'shop')}
          className="flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
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
