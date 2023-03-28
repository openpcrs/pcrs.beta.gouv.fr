import {createRequire} from 'node:module'
import {promisify} from 'node:util'
import zlib from 'node:zlib'
import {readFile} from 'node:fs/promises'

import union from '@turf/union'

const gunzip = promisify(zlib.gunzip)

async function readFeatures(fileName) {
  const buffer = await readFile(new URL('../sources/' + fileName, import.meta.url))
  return JSON.parse(await gunzip(buffer)).features
}

const communesFeatures = await readFeatures('communes.geojson.gz')
const epciFeatures = await readFeatures('epci.geojson.gz')
const departementsFeatures = await readFeatures('departements.geojson.gz')
const regionsFeatures = await readFeatures('regions.geojson.gz')

const featuresIndex = new Map()

for (const communeFeature of communesFeatures) {
  featuresIndex.set('commune:' + communeFeature.properties.code, communeFeature)
}

for (const epciFeature of epciFeatures) {
  featuresIndex.set('epci:' + epciFeature.properties.code, epciFeature)
}

for (const departementFeature of departementsFeatures) {
  featuresIndex.set('departement:' + departementFeature.properties.code, departementFeature)
}

for (const regionFeature of regionsFeatures) {
  featuresIndex.set('region:' + regionFeature.properties.code, regionFeature)
}

export function buildGeometryFromTerritoires(territories) {
  const territoriesFeatures = territories.map(territory => {
    const territoryFeature = featuresIndex.get(territory)

    if (!territoryFeature) {
      throw new Error('Territory not found: ' + territory)
    }

    return territoryFeature
  })

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
