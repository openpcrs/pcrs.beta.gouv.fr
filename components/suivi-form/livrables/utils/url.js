export function isURLValid(url) {
  const pattern = /\b(https?):\/\/[-\w+&@#/%?=~|!:,.;]*[-\w+&@#/%=~|]/i
  return pattern.test(url)
}
