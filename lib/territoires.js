import {createRequire} from 'node:module'
import Keyv from 'keyv'
import union from '@turf/union'

const keyv = new Keyv('sqlite://contours.sqlite')

export async function buildGeometryFromTerritoires(territories) {
  const territoriesFeatures = await Promise.all(territories.map(async territory => {
    const territoryFeature = await keyv.get(territory)

    if (!territoryFeature) {
      throw new Error('Territory not found: ' + territory)
    }

    return territoryFeature
  }))

  // eslint-disable-next-line unicorn/no-array-reduce
  return territoriesFeatures.reduce((acc, feature) => acc ? union(acc, feature) : feature).geometry
}

const require = createRequire(import.meta.url)

const communes = require('@etalab/decoupage-administratif/data/communes.json')
const epci = require('@etalab/decoupage-administratif/data/epci.json')
const departements = require('@etalab/decoupage-administratif/data/departements.json')
const regions = require('@etalab/decoupage-administratif/data/regions.json')

const territoiresIndex = new Set()

communes.filter(c => ['arrondissement-municipal', 'commune-actuelle'].includes(c.type))
  .forEach(c => {
    territoiresIndex.add(`commune:${c.code}`)
  })

epci.forEach(c => {
  territoiresIndex.add(`epci:${c.code}`)
})

departements.forEach(c => {
  territoiresIndex.add(`departement:${c.code}`)
})

regions.forEach(c => {
  territoiresIndex.add(`region:${c.code}`)
})

export function ensureTerritoireExists(codeTerritoire) {
  if (!territoiresIndex.has(codeTerritoire)) {
    throw new Error('Territory not found: ' + codeTerritoire)
  }
}
