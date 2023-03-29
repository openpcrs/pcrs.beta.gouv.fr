import {createRequire} from 'node:module'
import Keyv from 'keyv'
import LRUCache from 'lru-cache'
import hashObject from 'hash-obj'
import union from '@turf/union'

const keyv = new Keyv('sqlite://contours.sqlite')
const cache = new LRUCache({max: 500})

export async function buildGeometryFromTerritoires(territories) {
  // Compute a hash from arguments
  const hashKey = hashObject([...territories].sort(), {algorithm: 'md5'})

  // Re-use existing value in cache
  if (cache.has(hashKey)) {
    return cache.get(hashKey)
  }

  // Otherwise we compute the value (expensive task)
  const territoriesFeatures = await Promise.all(territories.map(async territory => {
    const territoryFeature = await keyv.get(territory)

    if (!territoryFeature) {
      throw new Error('Territory not found: ' + territory)
    }

    return territoryFeature
  }))

  // eslint-disable-next-line unicorn/no-array-reduce
  const resultGeometry = territoriesFeatures.reduce((acc, feature) => acc ? union(acc, feature) : feature).geometry

  // We store the value for further re-use
  cache.set(hashKey, resultGeometry)

  return resultGeometry
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
