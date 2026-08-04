import { useState, useRef } from 'react'
import { ImagePlus, Loader2, X, AlertCircle } from 'lucide-react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebase'
import { toDirectImageUrl } from '../utils/driveImage'

const EMPTY_IMAGES = ['', '', '', '']

const CATEGORIES = ['Women', 'Men', 'Child', 'Jewellery', 'Festival']

export default function ProductForm({ onSave, onCancel, product }) {
  const isEditing = Boolean(product)
  const productIdRef = useRef(product?.id || crypto.randomUUID())
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price ?? '',
    images: product?.images ? [...product.images, ...EMPTY_IMAGES].slice(0, 4) : [...EMPTY_IMAGES],
    category: product?.category || '',
    stock: product?.stock ?? '',
  })
  const [uploading, setUploading] = useState({})
  const [progress, setProgress] = useState({})
  const [error, setError] = useState('')
  const uploadTasks = useRef({})

  const validate = () => {
    if (!form.images[0] || !form.images[0].trim()) {
      setError('Please upload at least one product photo.')
      return false
    }
    setError('')
    return true
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (index, value) => {
    setForm((prev) => {
      const images = [...prev.images]
      images[index] = value
      return { ...prev, images }
    })
    if (index === 0 && value && error) setError('')
  }

  const MAX_SIZE_MB = 5

  const uploadFile = (file, index) => {
    if (!file || !file.type.startsWith('image/')) return

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Image ${index + 1} is too large. Max size is ${MAX_SIZE_MB}MB.`)
      return
    }

    // Cancel any previous upload for this slot
    if (uploadTasks.current[index]) {
      try { uploadTasks.current[index].cancel() } catch { /* ignore */ }
    }

    setUploading((prev) => ({ ...prev, [index]: true }))
    setProgress((prev) => ({ ...prev, [index]: 0 }))
    setError('')

    let task
    try {
      const productId = productIdRef.current
      const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
      const path = `products/${productId}/${Date.now()}_${index}_${safeName}`
      const storageRef = ref(storage, path)
      task = uploadBytesResumable(storageRef, file)
      uploadTasks.current[index] = task
    } catch (err) {
      console.error('Storage init failed:', err)
      setError('Could not start upload. Check that Firebase Storage is enabled and your bucket URL is correct.')
      setUploading((prev) => ({ ...prev, [index]: false }))
      setProgress((prev) => ({ ...prev, [index]: 0 }))
      return
    }

    task.on(
      'state_changed',
      (snapshot) => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        setProgress((prev) => ({ ...prev, [index]: pct }))
      },
      (err) => {
        console.error('Upload failed:', err)
        let message = 'Image upload failed. Please try again.'
        if (err.code === 'storage/unauthorized') {
          message = 'Upload denied: Firebase Storage rules do not allow writes. Please update your rules.'
        } else if (err.code === 'storage/canceled') {
          message = 'Upload was canceled.'
        } else if (err.code === 'storage/unknown') {
          message = 'Upload failed. Check that Firebase Storage is enabled and your bucket URL is correct.'
        }
        setError(message)
        setUploading((prev) => ({ ...prev, [index]: false }))
        setProgress((prev) => ({ ...prev, [index]: 0 }))
      },
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref)
          handleImageChange(index, url)
        } catch (err) {
          console.error('Download URL failed:', err)
          setError('Image uploaded but download URL could not be loaded.')
        } finally {
          setUploading((prev) => ({ ...prev, [index]: false }))
          setProgress((prev) => ({ ...prev, [index]: 0 }))
          delete uploadTasks.current[index]
        }
      }
    )
  }

  const handleFileSelect = (index, e) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file, index)
    e.target.value = ''
  }

  const removeImage = (index) => {
    if (uploadTasks.current[index]) {
      try { uploadTasks.current[index].cancel() } catch { /* ignore */ }
      delete uploadTasks.current[index]
    }
    handleImageChange(index, '')
    setUploading((prev) => ({ ...prev, [index]: false }))
    setProgress((prev) => ({ ...prev, [index]: 0 }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const updatedProduct = {
      id: productIdRef.current,
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      images: form.images.map((img) => img.trim()).filter(Boolean),
      category: form.category.trim(),
      stock: form.stock ? Number(form.stock) : undefined,
      createdAt: product?.createdAt || new Date().toISOString(),
    }
    onSave(updatedProduct)
  }

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

      {/* Image upload slots */}
      <div className="mt-6">
        <div className="mb-2 flex items-center gap-2">
          <ImagePlus className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Product images (up to 4) *</span>
        </div>
        <p className="mb-3 text-xs text-gray-400">
          First photo is required and will be the product thumbnail. Tap a box to upload from your gallery.
        </p>
        {error && (
          <p className="mb-3 text-xs font-medium text-red-600">{error}</p>
        )}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {form.images.map((img, idx) => {
            const preview = toDirectImageUrl(img)
            const isUploading = uploading[idx]
            return (
              <div key={idx} className="relative aspect-square">
                <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-whatsapp hover:bg-gray-100">
                  {preview ? (
                    <img
                      src={preview}
                      alt={`Preview ${idx + 1}`}
                      className="absolute inset-0 h-full w-full object-cover"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  ) : (
                    <div className="flex flex-col items-center p-2 text-center">
                      <ImagePlus className="mb-1 h-6 w-6 text-gray-400" />
                      <span className="text-[10px] text-gray-500">Image {idx + 1}</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileSelect(idx, e)}
                    disabled={isUploading}
                  />
                </label>

                {isUploading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-xl bg-black/60">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                    <span className="text-[10px] font-medium text-white">{progress[idx] ?? 0}%</span>
                  </div>
                )}

                {img && !isUploading && (
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

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
