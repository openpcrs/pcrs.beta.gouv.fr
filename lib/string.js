import {deburr} from 'lodash-es'

export function normalizeSort(string) {
  return deburr(string.toLowerCase())
}

export function stripNonNumericCharacters(phone) {
  return phone.replace(/\D/g, '')
}
