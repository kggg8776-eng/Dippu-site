import { useState, useEffect } from 'react'
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'
import { db } from '../firebase'

/**
 * Hook to sync products with Firestore.
 * Returns [products, addProduct, deleteProduct, loading]
 */
export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
      setProducts(items)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const addProduct = async (product) => {
    await setDoc(doc(db, 'products', product.id), product)
  }

  const updateProduct = async (product) => {
    await setDoc(doc(db, 'products', product.id), product)
  }

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, 'products', id))
  }

  return [products, addProduct, updateProduct, deleteProduct, loading]
}

/**
 * Hook to sync settings with Firestore.
 * Uses a single doc: settings/store
 */
export function useSettings(defaultSettings) {
  const [settings, setSettings] = useState(defaultSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'store'), (snap) => {
      if (snap.exists()) {
        setSettings(snap.data())
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const updateSettings = async (newSettings) => {
    setSettings(newSettings)
    await setDoc(doc(db, 'settings', 'store'), newSettings)
  }

  return [settings, updateSettings, loading]
}
