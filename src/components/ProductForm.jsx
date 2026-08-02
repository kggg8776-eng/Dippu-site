import { useState } from 'react'
import { ImagePlus } from 'lucide-react'
import { toDirectImageUrl } from '../utils/driveImage'

const EMPTY_IMAGES = ['', '', '', '']

const CATEGORIES = ['Women', 'Men', 'Child', 'Jewellery', 'Festival']

export default function ProductForm({ onSave, onCancel, product }) {
  const isEditing = Boolean(product)
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price ?? '',
    images: product?.images ? [...product.images, ...EMPTY_IMAGES].slice(0, 4) : [...EMPTY_IMAGES],
    category: product?.category || '',
    stock: product?.stock ?? '',
  })

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (index, value) => {
    setForm((prev) => {
      const images = [...prev.images]
      images[index] = value
      return { ...prev, images }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const updatedProduct = {
      id: product?.id || crypto.randomUUID(),
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      images: form.images.map((img) => img.trim()),
      category: form.category.trim(),
      stock: form.stock ? Number(form.stock) : undefined,
      createdAt: product?.createdAt || new Date().toISOString(),
    }
    onSave(updatedProduct)
  }

  const previewImages = form.images.map(toDirectImageUrl).filter(Boolean)

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:mb-8 sm:p-6"
    >
      <h3 className="mb-4 text-lg font-bold text-gray-900">{isEditing ? 'Edit product' : 'Add new product'}</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Product name *</label>
          <input
            required
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-whatsapp focus:ring-2 focus:ring-whatsapp/20"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-whatsapp focus:ring-2 focus:ring-whatsapp/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price (₹) *</label>
          <input
            type="number"
            step="0.01"
            min={0}
            required
            value={form.price}
            onChange={(e) => handleChange('price', e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-whatsapp focus:ring-2 focus:ring-whatsapp/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Stock (optional)</label>
          <input
            type="number"
            min={0}
            value={form.stock}
            onChange={(e) => handleChange('stock', e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-whatsapp focus:ring-2 focus:ring-whatsapp/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category *</label>
          <select
            required
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-whatsapp focus:ring-2 focus:ring-whatsapp/20"
          >
            <option value="" disabled>Choose a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 Image URL fields */}
      <div className="mt-6">
        <div className="mb-2 flex items-center gap-2">
          <ImagePlus className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Product images (up to 4)</span>
        </div>
        <p className="mb-3 text-xs text-gray-400">
          Paste a direct URL, Google Drive share link, or Mega drive link. Google Drive links are auto-converted.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {form.images.map((img, idx) => (
            <div key={idx}>
              <label className="block text-xs font-medium text-gray-500">Image {idx + 1}</label>
              <input
                value={img}
                onChange={(e) => handleImageChange(idx, e.target.value)}
                placeholder="https://drive.google.com/file/d/... or direct URL"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-whatsapp focus:ring-2 focus:ring-whatsapp/20"
              />
            </div>
          ))}
        </div>
      </div>

      {previewImages.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-gray-500">Image preview</p>
          <div className="flex gap-3 overflow-x-auto">
            {previewImages.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Preview ${idx + 1}`}
                className="h-24 w-24 shrink-0 rounded-lg border border-gray-100 object-cover"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          {isEditing ? 'Update product' : 'Save product'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
