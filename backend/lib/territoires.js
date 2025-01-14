import {createRequire} from 'node:module'
import {readFile} from 'node:fs/promises'
import Keyv from 'keyv'
import KeyvSqlite from '@keyv/sqlite'
import {LRUCache} from 'lru-cache'
import hashObject from 'hash-object'
import union from '@turf/union'
import {keyBy} from 'lodash-es'

async function getSuperficies() {
  const data = await readFile('.db/superficies.json')

  return JSON.parse(data)
}

const keyvStore = new KeyvSqlite('sqlite://.db/contours.sqlite')
const keyv = new Keyv({store: keyvStore})

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
      console.error('Territory not found: ' + territory)
      return
    }

    return territoryFeature
  }))

  // eslint-disable-next-line unicorn/no-array-reduce
  const resultGeometry = territoriesFeatures.reduce((acc, feature) => {
    if (!feature?.geometry) {
      return acc
    }

    return acc ? union(acc, feature) : feature
  })?.geometry

  // We store the value for further re-use
  cache.set(hashKey, resultGeometry)

  return resultGeometry
}

const require = createRequire(import.meta.url)

const communes = require('@etalab/decoupage-administratif/data/communes.json')
const epci = require('@etalab/decoupage-administratif/data/epci.json')
const departements = require('@etalab/decoupage-administratif/data/departements.json')
const regions = require('@etalab/decoupage-administratif/data/regions.json')

const territoiresIndex = new Map()

communes.filter(c => ['arrondissement-municipal', 'commune-actuelle'].includes(c.type))
  .forEach(c => {
    territoiresIndex.set(`commune:${c.code}`, c)
  })

epci.forEach(c => {
  territoiresIndex.set(`epci:${c.code}`, c)
})

departements.forEach(c => {
  territoiresIndex.set(`departement:${c.code}`, c)
})

regions.forEach(c => {
  territoiresIndex.set(`region:${c.code}`, c)
})

export function ensureTerritoireExists(codeTerritoire) {
  if (!territoiresIndex.has(codeTerritoire)) {
    throw new Error('Territory not found: ' + codeTerritoire)
  }
}

export function getTerritoiresProperties(codeTerritoire) {
  ensureTerritoireExists(codeTerritoire)

  return territoiresIndex.get(codeTerritoire)
}

const areas = await getSuperficies()
const areasIndexes = keyBy(areas, 'territory')

export async function getAreaFromTerritory(territoryCode) {
  const foundTerritoryArea = areasIndexes[territoryCode]

  return foundTerritoryArea?.area
}
