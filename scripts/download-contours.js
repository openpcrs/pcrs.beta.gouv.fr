#!/usr/bin/env node
import {promisify} from 'node:util'
import {mkdir} from 'node:fs/promises'
import zlib from 'node:zlib'
import Keyv from 'keyv'
import got from 'got'

const gunzip = promisify(zlib.gunzip)

const MILLESIME = '2022'
const RESOLUTION = '100m'

await mkdir('./.db')

const keyv = new Keyv('sqlite://.db/contours.sqlite')

await keyv.clear()

async function storeLayer(layerName, getKey) {
  // Downloading dataset
  const url = `http://etalab-datasets.geo.data.gouv.fr/contours-administratifs/${MILLESIME}/geojson/${layerName}-${RESOLUTION}.geojson.gz`
  const buffer = await got(url).buffer()

  // Extracting features
  const {features} = JSON.parse(await gunzip(buffer))

  // Storing features in key/value database
  await Promise.all(features.map(async feature => {
    const key = getKey(feature)
    await keyv.set(key, feature)
  }))
}

console.log('  * Téléchargement des contours des communes')
await storeLayer('communes', f => `commune:${f.properties.code}`)

console.log('  * Téléchargement des contours des EPCI')
await storeLayer('epci', f => `epci:${f.properties.code}`)

console.log('  * Téléchargement des contours des départements')
await storeLayer('departements', f => `departement:${f.properties.code}`)

console.log('  * Téléchargement des contours des régions')
await storeLayer('regions', f => `region:${f.properties.code}`)
