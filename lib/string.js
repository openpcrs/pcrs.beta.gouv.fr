import {deburr} from 'lodash-es'

export function normalizeSort(string) {
  return deburr(string.toLowerCase())
}

export function normalizeSring(string) {
  // Remove accents with lodash.deburr, lowercase, remove leading and trailing spaces, and replace multiple spaces with a single space
  return deburr(string).toLowerCase().trim().replaceAll(/\s+/g, ' ')
}

export function stripNonNumericCharacters(string) {
  return string.replaceAll(/\D/g, '')
}

export function formatInternationalPhone(phone) {
  // Keep the '+' character if the number starts with it
  let formatted = phone.startsWith('+') ? '+' : ''

  formatted += phone.replaceAll(/\D/g, '')

  return formatted
}

export function formatNumber(number) {
  const numStr = number.toString()

  // Use a regular expression to add a space every three digits
  return numStr.replaceAll(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
