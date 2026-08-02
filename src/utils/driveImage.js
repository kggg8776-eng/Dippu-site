/**
 * Converts Google Drive or Mega share links to embeddable/viewable image URLs.
 * Falls through to original URL if format is unrecognised.
 */
export function toDirectImageUrl(url) {
  if (!url || typeof url !== 'string') return ''
  const trimmed = url.trim()
  if (!trimmed) return ''

  // Google Image Search result: extract the actual image URL from the imgurl param
  if (trimmed.includes('google.com/imgres')) {
    try {
      const parsed = new URL(trimmed)
      const imgurl = parsed.searchParams.get('imgurl')
      if (imgurl) return imgurl
    } catch { /* fall through */ }
  }

  // Google Drive: /file/d/FILE_ID/...
  const gdriveMatch = trimmed.match(/drive\.google\.com\/file\/d\/([^/]+)/)
  if (gdriveMatch) {
    return `https://drive.google.com/uc?export=view&id=${gdriveMatch[1]}`
  }

  // Google Drive: open?id=FILE_ID
  const gdriveOpen = trimmed.match(/drive\.google\.com\/open\?id=([^&]+)/)
  if (gdriveOpen) {
    return `https://drive.google.com/uc?export=view&id=${gdriveOpen[1]}`
  }

  // Google Drive: uc?id=FILE_ID (already direct)
  if (trimmed.includes('drive.google.com/uc')) {
    return trimmed
  }

  // Mega links — no reliable direct-embed conversion exists;
  // keep the URL as-is so admins can paste a direct mega.nz thumbnail if available.
  // For best results, users should use the Mega "Get link" → "Decryption key" approach
  // or export a direct image URL from the Mega web viewer.

  return trimmed
}

/**
 * Returns the first non-empty image URL from an array of image URLs.
 */
export function primaryImage(images) {
  if (!images) return ''
  if (typeof images === 'string') return toDirectImageUrl(images)
  if (Array.isArray(images)) {
    for (const img of images) {
      const url = toDirectImageUrl(img)
      if (url) return url
    }
  }
  return ''
}

/**
 * Returns all non-empty image URLs from an array.
 */
export function allImages(images) {
  if (!images) return []
  if (typeof images === 'string') {
    const url = toDirectImageUrl(images)
    return url ? [url] : []
  }
  if (Array.isArray(images)) {
    return images.map(toDirectImageUrl).filter(Boolean)
  }
  return []
}
