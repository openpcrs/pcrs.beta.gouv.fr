export function isURLValid(url) {
  const urlPattern = /^https?:\/\//
  return urlPattern.test(url)
}
