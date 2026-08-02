export const defaultSettings = {
  storeName: 'My WhatsApp Shop',
  phoneNumber: '',
  currency: '₹',
  welcomeMessage: 'Thanks for your order!',
}

export const defaultProducts = [
  {
    id: 'sample-1',
    name: 'Sample T-Shirt',
    description: 'A comfortable cotton t-shirt available in multiple sizes. Perfect for everyday wear.',
    price: 19.99,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
      '',
      '',
      '',
    ],
    category: 'Fashion',
    stock: 10,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-2',
    name: 'Wireless Earbuds',
    description: 'Crisp sound and long battery life. Great for workouts and calls.',
    price: 49.99,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
      '',
      '',
      '',
    ],
    category: 'Electronics',
    stock: 5,
    createdAt: new Date().toISOString(),
  },
]
