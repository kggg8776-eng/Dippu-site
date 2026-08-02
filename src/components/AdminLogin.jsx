import { useState } from 'react'
import { Lock, Mail, Phone } from 'lucide-react'

const ADMIN_PHONE = import.meta.env.VITE_ADMIN_PHONE || ''
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || ''
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || ''

export default function AdminLogin({ onLogin }) {
  const [mode, setMode] = useState('phone') // 'phone' or 'email'
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const trimmed = identifier.trim()
    if (!trimmed || !password) {
      setError('Please fill in all fields.')
      return
    }

    const matchesIdentifier =
      mode === 'phone'
        ? ADMIN_PHONE === trimmed
        : ADMIN_EMAIL.toLowerCase() === trimmed.toLowerCase()

    if (matchesIdentifier && ADMIN_PASSWORD === password) {
      onLogin()
    } else {
      setError('Invalid credentials. Please try again.')
    }
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-lg"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp/10">
            <Lock className="h-7 w-7 text-whatsapp-dark" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
          <p className="mt-1 text-sm text-gray-500">Sign in to manage your store</p>
        </div>

        {/* Toggle: Phone / Email */}
        <div className="mb-5 flex rounded-xl border border-gray-200 p-1">
          <button
            type="button"
            onClick={() => { setMode('phone'); setError('') }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition ${
              mode === 'phone' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Phone className="h-4 w-4" /> Phone
          </button>
          <button
            type="button"
            onClick={() => { setMode('email'); setError('') }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition ${
              mode === 'email' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Mail className="h-4 w-4" /> Email
          </button>
        </div>

        {/* Identifier */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            {mode === 'phone' ? 'Phone number' : 'Email address'}
          </label>
          <input
            type={mode === 'phone' ? 'tel' : 'email'}
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={mode === 'phone' ? 'e.g. 9876543210' : 'admin@example.com'}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-whatsapp focus:ring-2 focus:ring-whatsapp/20"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-whatsapp focus:ring-2 focus:ring-whatsapp/20"
          />
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          className="w-full rounded-xl bg-whatsapp py-2.5 text-sm font-bold text-white transition hover:bg-green-600"
        >
          Sign in
        </button>
      </form>
    </main>
  )
}
