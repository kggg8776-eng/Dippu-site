import { useState, useMemo, useRef } from 'react'
import { Search } from 'lucide-react'
import Header from './components/Header'
import HeroBanner from './components/HeroBanner'
import CategorySection from './components/CategorySection'
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

  const productsRef = useRef(null)

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
    const fixed = ['All', 'Women', 'Men', 'Child', 'Jewellery', 'Festival']
    const set = new Set(products.map((p) => p.category).filter(Boolean))
    const dynamic = Array.from(set).filter((cat) => !fixed.includes(cat))
    return [...fixed, ...dynamic]
  }, [products])

  const productCounts = useMemo(() => {
    const counts = { All: products.length }
    products.forEach((p) => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1
      }
    })
    return counts
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [products, search, selectedCategory])

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat)
    setTimeout(() => scrollToProducts(), 100)
  }

  if (productsLoading || settingsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500" />
          <p className="mt-3 text-sm text-gray-500">Loading store...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header storeName={settings.storeName} view={view} setView={setView} />

      {view === 'shop' ? (
        <>
          {/* Hero Banner */}
          <HeroBanner storeName={settings.storeName} onShopNow={scrollToProducts} />

          {/* Category Section */}
          <CategorySection
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={handleCategorySelect}
            productCounts={productCounts}
          />

          {/* Products Section */}
          <section ref={productsRef} className="mx-auto max-w-7xl px-4 pb-16">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                </h2>
                <p className="text-sm text-gray-500">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                </p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 sm:w-64"
                />
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <EmptyState isAdmin={isAdminLoggedIn} onAdd={() => setView('admin')} selectedCategory={selectedCategory} />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
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
          </section>
        </>
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
