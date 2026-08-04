import { Gem, Mail, Phone, MessageCircle, Instagram, Facebook, Youtube, Twitter } from 'lucide-react'

const SOCIAL_ICONS = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  twitter: Twitter,
}

export default function Footer({ settings }) {
  const {
    storeName = 'Dippu Collection',
    footerTagline = 'Your fashion destination',
    phoneNumber = '',
    email = '',
    socialLinks = {},
  } = settings || {}

  const currentYear = new Date().getFullYear()
  const hasContact = phoneNumber || email
  const hasSocials = Object.values(socialLinks || {}).some(Boolean)

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 shadow-sm">
                <Gem className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-white">{storeName}</h2>
            </div>
            {footerTagline && <p className="text-sm leading-relaxed text-gray-400">{footerTagline}</p>}
          </div>

          {/* Contact */}
          {hasContact && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Contact us</h3>
              <ul className="space-y-2.5">
                {phoneNumber && (
                  <li>
                    <a
                      href={`https://wa.me/${phoneNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-400 transition hover:text-whatsapp"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>WhatsApp</span>
                    </a>
                  </li>
                )}
                {phoneNumber && (
                  <li>
                    <a
                      href={`tel:${phoneNumber}`}
                      className="flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
                    >
                      <Phone className="h-4 w-4" />
                      <span>{phoneNumber}</span>
                    </a>
                  </li>
                )}
                {email && (
                  <li>
                    <a
                      href={`mailto:${email}`}
                      className="flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
                    >
                      <Mail className="h-4 w-4" />
                      <span>{email}</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Socials */}
          {hasSocials && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Follow us</h3>
              <div className="flex flex-wrap gap-2.5">
                {Object.entries(socialLinks).map(([key, url]) => {
                  if (!url) return null
                  const Icon = SOCIAL_ICONS[key] || MessageCircle
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-full bg-gray-800 px-3 py-1.5 text-sm text-gray-300 transition hover:bg-gray-700 hover:text-white"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="capitalize">{key}</span>
                    </a>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          &copy; {currentYear} {storeName}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
