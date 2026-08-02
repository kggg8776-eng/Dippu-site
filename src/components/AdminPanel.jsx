import { useState } from 'react'
import { Plus, Trash2, Package, IndianRupee } from 'lucide-react'
import ProductForm from './ProductForm'
import AdminLogin from './AdminLogin'
import { primaryImage, allImages } from '../utils/driveImage'

export default function AdminPanel({ products, onAdd, onDelete, settings, onSettingsChange, isLoggedIn, onLogin, onLogout }) {
  const [showForm, setShowForm] = useState(false)

  const updateSetting = (key, value) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  // Show login screen if not authenticated
  if (!isLoggedIn) {
    return <AdminLogin onLogin={onLogin} />
  }

  return (
    <main className="mx-auto max-w-5xl px-3 py-6 sm:px-4 sm:py-8">
      {/* Store settings */}
      <section className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:mb-8 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">Store settings</h2>
          <button
            onClick={onLogout}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Store name</label>
            <input
              value={settings.storeName}
              onChange={(e) => updateSetting('storeName', e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-whatsapp focus:ring-2 focus:ring-whatsapp/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">WhatsApp number</label>
            <input
              value={settings.phoneNumber}
              onChange={(e) => updateSetting('phoneNumber', e.target.value)}
              placeholder="e.g. 919876543210"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-whatsapp focus:ring-2 focus:ring-whatsapp/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Currency</label>
            <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2">
              <IndianRupee className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Rupees (₹)</span>
            </div>
            <p className="mt-1 text-xs text-gray-400">Currency is fixed to Indian Rupees.</p>
          </div>
        </div>

        <p className="mt-3 text-xs text-gray-500">
          Enter your WhatsApp number with country code and no spaces, e.g. 919876543210 for India.
        </p>
      </section>

      {/* Products header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-gray-900 sm:text-xl">Products ({products.length})</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-whatsapp px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-600 sm:gap-2 sm:px-4 sm:text-sm"
          >
            <Plus className="h-4 w-4" />
            Add product
          </button>
        )}
      </div>

      {showForm && (
        <ProductForm
          onSave={(product) => {
            onAdd(product)
            setShowForm(false)
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {products.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white py-16 text-center">
          <Package className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-gray-500">No products yet. Add one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => {
            const thumb = primaryImage(product.images || product.image)
            const imgCount = allImages(product.images || product.image).length
            return (
              <div
                key={product.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:gap-4 sm:p-4"
              >
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-14 sm:w-14">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">No image</div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="truncate font-semibold text-gray-900">{product.name}</h4>
                    <p className="truncate text-xs text-gray-500 sm:text-sm">
                      ₹{Number(product.price).toFixed(2)}
                      {product.category && ` • ${product.category}`}
                      {imgCount > 1 && ` • ${imgCount} images`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onDelete(product.id)}
                  className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                  aria-label="Delete product"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
