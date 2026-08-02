import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import Header from './components/Header'
import ProductCard from './components/ProductCard'
import OrderModal from './components/OrderModal'
import ProductModal from './components/HoverPreview'
import EmptyState from './components/EmptyState'
import AdminPanel from './components/AdminPanel'
import { useProducts, useSettings } from './hooks/useFirestore'
import { defaultSettings } from './data/seed'

export default function App() {
  const [products, addProduct, updateProduct, deleteProduct, productsLoading] = useProducts()
  const [settings, setSettings, settingsLoading] = useSettings(defaultSettings)

  const [view, setView] = useState('shop')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [previewProduct, setPreviewProduct] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Admin auth state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    () => sessionStorage.getItem('wpshop_admin_session') === 'true'
  )

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true)
    sessionStorage.setItem('wpshop_admin_session', 'true')
  }


  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false)
    sessionStorage.removeItem('wpshop_admin_session')
    setView('shop')
  }

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean))
    return ['All', ...Array.from(set)]
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [products, search, selectedCategory])

  if (productsLoading || settingsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-green-500" />
          <p className="mt-3 text-sm text-gray-500">Loading store...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header storeName={settings.storeName} view={view} setView={setView} />

      {view === 'shop' ? (
        <main className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Our products</h2>
              <p className="text-sm text-gray-500">Select a product and order directly on WhatsApp.</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-whatsapp focus:ring-2 focus:ring-whatsapp/20 sm:w-64"
              />
            </div>
          </div>

          {categories.length > 1 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    selectedCategory === category
                      ? 'bg-gray-900 text-white'
                      : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <EmptyState isAdmin onAdd={() => setView('admin')} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currency={settings.currency}
                  onOrder={setSelectedProduct}
                  onPreview={setPreviewProduct}
                />
              ))}
            </div>
          )}
        </main>
      ) : (
        <AdminPanel
          products={products}
          onAdd={addProduct}
          onEdit={updateProduct}
          onDelete={deleteProduct}
          settings={settings}
          onSettingsChange={setSettings}
          isLoggedIn={isAdminLoggedIn}
          onLogin={handleAdminLogin}
          onLogout={handleAdminLogout}
        />
      )}

      {previewProduct && (
        <ProductModal
          product={previewProduct}
          currency={settings.currency}
          onOrder={(p) => { setPreviewProduct(null); setSelectedProduct(p) }}
          onClose={() => setPreviewProduct(null)}
        />
      )}

      {selectedProduct && (
        <OrderModal
          product={selectedProduct}
          currency={settings.currency}
          settings={settings}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  )
}
