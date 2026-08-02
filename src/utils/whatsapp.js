export function buildWhatsAppUrl(phone, { product, quantity, name, notes, currency }) {
  const cleanPhone = String(phone || '').replace(/\D/g, '')
  if (!cleanPhone) return null

  const qty = Number(quantity || 1)
  const total = (Number(product.price || 0) * qty).toFixed(2)

  const lines = [
    'Hi, I would like to place an order:',
    '',
    `*Product:* ${product.name}`,
    `*Price:* ${currency}${Number(product.price).toFixed(2)}`,
    `*Quantity:* ${qty}`,
    `*Total:* ${currency}${total}`,
    `*Customer:* ${name}`,
  ]

  if (notes) lines.push(`*Notes:* ${notes}`)

  const text = lines.join('\n')
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
}
