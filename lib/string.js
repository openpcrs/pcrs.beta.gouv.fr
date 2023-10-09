import {deburr} from 'lodash-es'

export function normalizeSort(string) {
  return deburr(string.toLowerCase())
}

export function stripNonNumericCharacters(string) {
  return string.replace(/\D/g, '')
}

export function formatInternationalPhone(phone) {
  // Keep the '+' character if the number starts with it
  let formatted = phone.startsWith('+') ? '+' : ''

  formatted += phone.replace(/\D/g, '')

  return formatted
}
