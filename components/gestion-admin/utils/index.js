import {deburr} from 'lodash-es'

export function normalizeSort(nom) {
  return deburr(nom.toLowerCase())
}

