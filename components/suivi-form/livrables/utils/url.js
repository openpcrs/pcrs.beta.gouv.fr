export function isURLValid(url) {
  const pattern = /(\b(https?|ftp|file):\/\/[-\w+&@#/%?=~|!:,.;]*[-\w+&@#/%=~|])/i
  return pattern.test(url)
}
