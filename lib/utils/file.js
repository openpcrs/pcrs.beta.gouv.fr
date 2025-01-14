export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) {
    return '0 Bytes'
  }

  const k = 1024
  const dm = Math.max(decimals, 0)
  const sizes = ['Octets', 'Ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / (k ** i)).toFixed(dm)) + ' ' + sizes[i]
}
