import { Package, Plus } from 'lucide-react'

export default function EmptyState({ isAdmin, onAdd, selectedCategory }) {
  const categoryLabel = selectedCategory && selectedCategory !== 'All'
    ? `for ${selectedCategory}`
    : 'in this store'

  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-white py-16 text-center sm:py-20">
      <div className="rounded-full bg-gray-50 p-4">
        <Package className="h-10 w-10 text-gray-300" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">No products found</h3>
      <p className="mt-1 max-w-xs text-sm text-gray-500">
        New stock {categoryLabel} is not available right now. Check back soon!
      </p>
      {isAdmin && (
        <button
          onClick={onAdd}
          className="mt-5 flex items-center gap-2 rounded-xl bg-whatsapp px-5 py-2.5 font-semibold text-white transition hover:bg-green-600"
        >
          <Plus className="h-4 w-4" />
          Add your first product
        </button>
      )}
    </div>
  )
}
