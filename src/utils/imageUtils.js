/**
 * Compresses an image file and returns it as a base64 data URL.
 * Used as a free alternative when Firebase Storage is not available.
 */
export function compressImageToBase64(file, { maxWidth = 1200, maxHeight = 1200, quality = 0.8, maxSizeBytes = 600 * 1024 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Only image files are allowed.'))
      return
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read image file.'))
    reader.onload = (event) => {
      const img = new Image()
      img.onerror = () => reject(new Error('Could not load image.'))
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          let { width, height } = img

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height)
            width = Math.round(width * ratio)
            height = Math.round(height * ratio)
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(0, 0, width, height)
          ctx.drawImage(img, 0, 0, width, height)

          let dataUrl = canvas.toDataURL('image/jpeg', quality)

          // If still too large, keep reducing quality/size
          let attempts = 0
          while (dataUrl.length > maxSizeBytes && attempts < 5) {
            quality = Math.max(0.3, quality - 0.15)
            const scale = Math.max(0.5, 1 - (dataUrl.length - maxSizeBytes) / dataUrl.length)
            width = Math.round(width * scale)
            height = Math.round(height * scale)
            canvas.width = width
            canvas.height = height
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(0, 0, width, height)
            ctx.drawImage(img, 0, 0, width, height)
            dataUrl = canvas.toDataURL('image/jpeg', quality)
            attempts += 1
          }

          if (dataUrl.length > maxSizeBytes) {
            reject(new Error('Image is too large even after compression. Try a smaller image.'))
            return
          }

          resolve(dataUrl)
        } catch (err) {
          reject(err)
        }
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  })
}
