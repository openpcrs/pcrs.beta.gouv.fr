import {promisify} from 'node:util'
import zlib from 'node:zlib'

import got from 'got'
import union from '@turf/union'

const gunzip = promisify(zlib.gunzip)

async function fetchFeatures(url) {
  const buffer = await got(url).buffer()
  return JSON.parse(await gunzip(buffer)).features
}

export async function createGeometryBuilder() {
  const communesFeatures = await fetchFeatures('http://etalab-datasets.geo.data.gouv.fr/contours-administratifs/2022/geojson/communes-50m.geojson.gz')
  const epciFeatures = await fetchFeatures('http://etalab-datasets.geo.data.gouv.fr/contours-administratifs/2022/geojson/epci-50m.geojson.gz')
  const departementsFeatures = await fetchFeatures('http://etalab-datasets.geo.data.gouv.fr/contours-administratifs/2022/geojson/departements-50m.geojson.gz')
  const regionsFeatures = await fetchFeatures('http://etalab-datasets.geo.data.gouv.fr/contours-administratifs/2022/geojson/regions-50m.geojson.gz')

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

  return {
    buildFromTerritories(territories) {
      const territoriesFeatures = territories.map(territory => {
        const territoryFeature = featuresIndex.get(territory)

        if (!territoryFeature) {
          throw new Error('Territory not found: ' + territory)
        }

        return territoryFeature
      })

      // eslint-disable-next-line unicorn/no-array-reduce
      return territoriesFeatures.reduce((acc, feature) => acc ? union(acc, feature) : feature).geometry
    },
    getTerritoriesName(territories) {
      const territoriesNames = territories.map(territory => {
        const territoryName = featuresIndex.get(territory)?.properties?.nom

        if (!territoryName) {
          throw new Error('Territory name not found:' + territory)
        }

        return territoryName
      })

      return territoriesNames
    }
  }
}

