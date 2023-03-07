#!/usr/bin/env node
import {downloadTo} from '../lib/download.js'

console.log('  * Téléchargement de communes.geojson.gz')

await downloadTo(
  'http://etalab-datasets.geo.data.gouv.fr/contours-administratifs/2022/geojson/communes-50m.geojson.gz',
  '../sources/communes.geojson.gz',
  import.meta.url
)

console.log('  * Téléchargement de epci.geojson.gz')

await downloadTo(
  'http://etalab-datasets.geo.data.gouv.fr/contours-administratifs/2022/geojson/epci-50m.geojson.gz',
  '../sources/epci.geojson.gz',
  import.meta.url
)

console.log('  * Téléchargement de departements.geojson.gz')

await downloadTo(
  'http://etalab-datasets.geo.data.gouv.fr/contours-administratifs/2022/geojson/departements-50m.geojson.gz',
  '../sources/departements.geojson.gz',
  import.meta.url
)

console.log('  * Téléchargement de regions.geojson.gz')

await downloadTo(
  'http://etalab-datasets.geo.data.gouv.fr/contours-administratifs/2022/geojson/regions-50m.geojson.gz',
  '../sources/regions.geojson.gz',
  import.meta.url
)
