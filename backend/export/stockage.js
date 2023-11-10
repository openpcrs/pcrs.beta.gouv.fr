/* eslint-disable no-await-in-loop */
import {keyBy} from 'lodash-es'
import mongo from '../util/mongo.js'
import {getStockage, getStockageGeoJSON, getStockageData} from '../../lib/pcrs-scanner-api.js'

async function computeStockagesList() {
  const projets = mongo.db.collection('projets').find({'livrables.stockage_id': {$ne: null}})
  const stockages = []

  for await (const projet of projets) {
    for (const livrable of projet.livrables) {
      stockages.push({
        projet: projet._id,
        stockage: livrable.stockage_id
      })
    }
  }

  return stockages
}

export async function computeLivrablesGeoJSON() {
  const stockages = await computeStockagesList()
  const features = []

  for (const {projet, stockage} of stockages) {
    try {
      const stockageMeta = await getStockage(stockage)

      if (!stockageMeta?.result?.raster?.envelope) {
        continue
      }

      features.push({
        type: 'Feature',
        geometry: stockageMeta.result.raster.envelope,
        properties: {
          initiative: projet,
          dateActualite: null,
          calendrier: null,
          format: getFormat(stockageMeta.result.raster.format),
          compression: stockageMeta.result.raster.compression,
          epsg: stockageMeta.result.raster.projection.code,
          taille: stockageMeta.result.raster.sizeRasterFiles,
          recouvrement: null
        }
      })
    } catch {}
  }

  return {type: 'FeatureCollection', features}
}

export async function computeDallesGeoJSON() {
  const stockages = await computeStockagesList()
  const features = []

  for (const {projet, stockage} of stockages) {
    try {
      const dallesMeta = await getStockageData(stockage)
      const indexedDalles = keyBy(dallesMeta, 'name')
      const {features: dallesFeatures} = await getStockageGeoJSON(stockage)

      for (const feature of dallesFeatures) {
        const {geometry} = feature
        const dalle = indexedDalles[feature.properties.name]

        if (!dalle) {
          continue
        }

        features.push({
          type: 'Feature',
          geometry,
          properties: {
            dateAcquisition: null,
            dateRecette: null,
            descriptionElementsQualite: null,
            idPCRS: projet,
            nomImage: dalle.name,
            precisionplanimetriqueCorpsdeRue: null,
            precisionplanimetriqueZonesNaturelles: null,
            resolution: getResolution(dalle.computedMetadata.pixelSize?.height),
            typeImage: getFormat(dalle.dataFormat),
            producteur: null,
            tailleFichier: dalle.size,
            tailleImage: getTaille(dalle.computedMetadata.size),
            compression: dalle.computedMetadata.compression,
            epsg: dalle.computedMetadata.projection.code,
            bandes: getBandes(dalle.computedMetadata.bands),
            open: true
          }
        })
      }
    } catch {}
  }

  return {type: 'FeatureCollection', features}
}

function getFormat(originalFormat) {
  if (originalFormat === 'geotiff') {
    return 'image/tiff'
  }

  if (originalFormat === 'jpeg2000') {
    return 'image/jp2'
  }
}

function getResolution(originalResolution) {
  return originalResolution ? originalResolution * 100 : null
}

function getBandes(originalBands) {
  if (!originalBands || originalBands.length === 0) {
    return null
  }

  return originalBands.map(band => `${band.colorInterpretation || 'Unknown'}(${band.dataType || 'Unknown'})`).join('/')
}

function getTaille(originalSize) {
  return `${originalSize.height}x${originalSize.width}`
}
