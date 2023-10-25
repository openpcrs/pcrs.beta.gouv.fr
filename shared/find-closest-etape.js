import {maxBy} from 'lodash-es'

export function findClosestEtape(etapes) {
  if (etapes.some(etape => etape.date_debut)) {
    const now = new Date()

    const filteredLaterSteps = etapes.filter(etape => new Date(etape.date_debut) <= now)
    if (filteredLaterSteps.length > 0) {
      return maxBy(filteredLaterSteps, etape => new Date(etape.date_debut))
    }

    return etapes[0]
  }

  // When "Etapes" has no date, use last one
  return etapes.at(-1)
}

