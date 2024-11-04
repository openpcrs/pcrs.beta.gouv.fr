/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
import {keyBy} from 'lodash-es'
import mongo from '../util/mongo.js'
import {getStockage, getStockageGeoJSON, getStockageData} from '../../lib/pcrs-scanner-api.js'
import {findClosestEtape} from '../../shared/find-closest-etape.js'

async function computeStockagesList() {
  const projets = mongo.db.collection('projets').find({'livrables.stockage_id': {$ne: null}})
  const stockages = []

  for await (const projet of projets) {
    for (const liv of projet.livrables) {
      stockages.push({
        refProjet: projet._id,
        livrable: liv,
        etapes: projet.etapes,
        subventions: projet.subventions,
        acteurs: projet.acteurs,
        refStockage: liv.stockage_id
      })
    }
  }

  return stockages
}

export async function computeLivrablesGeoJSON() {
  const stockages = await computeStockagesList()
  const features = []

  const pcrsCalendrier = {
    investigation: '03',
    convention_signee: '03',
    marche_public_en_cours: '03',
    prod_en_cours: '02',
    controle_en_cours: '02',
    realise: '01',
    disponible: '01',
    obsolete: '01'
  }

  for (const {refProjet, livrable, etapes, subventions, acteurs, refStockage} of stockages) {
    try {
      const stockageMeta = await getStockage(refStockage)

      if (!stockageMeta?.result?.raster?.envelope) {
        continue
      }

      // Calendrier du projet
      const projetStatut = findClosestEtape(etapes)
      const projetCalendrier = pcrsCalendrier[projetStatut.statut]
      const projetDateActualite = projetStatut.date_debut

      // Subventions / acteurs
      const projetSubventions = []
      for (const subvention of subventions) {
        projetSubventions.push(subvention.nature)
      }

      const projetActeurs = []
      for (const acteur of acteurs) {
        projetActeurs.push(acteur.nom)
      }

      features.push({
        type: 'Feature',
        geometry: stockageMeta.result.raster.envelope,
        properties: {
          initiative: refProjet,
          dateActualite: projetDateActualite || null,
          calendrier: projetCalendrier || null,
          format: getFormat(stockageMeta.result.raster.format),
          compression: stockageMeta.result.raster.compression,
          epsg: stockageMeta.result.raster.projection.code,
          taille: stockageMeta.result.raster.sizeRasterFiles,
          recouvr_lat: livrable.recouvr_lat,
          recouvr_lon: livrable.recouvr_lon,
          focale: livrable.focale || null,
          licence: livrable.licence || null,
          subventions: [...new Set(projetSubventions)],
          acteurs: [...new Set(projetActeurs)],
          diffusionUrl: livrable.diffusion_url || null,
          diffusionLayer: livrable.diffusion_layer || null
        }
      })
    } catch {}
  }

  return {type: 'FeatureCollection', features}
}

export async function computeDallesGeoJSON() {
  const stockages = await computeStockagesList()
  const features = []

  for (const {refProjet, livrable, refStockage} of stockages) {
    try {
      const dallesMeta = await getStockageData(refStockage)
      const indexedDalles = keyBy(dallesMeta, 'name')
      const {features: dallesFeatures} = await getStockageGeoJSON(refStockage)

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
            idPCRS: refProjet,
            nomImage: dalle.name,
            precisionplanimetriqueCorpsdeRue: null,
            precisionplanimetriqueZonesNaturelles: null,
            resolution: getResolution(dalle.computedMetadata.pixelSize?.height),
            typeImage: getFormat(dalle.dataFormat),
            producteur: null,
            licence: livrable.licence || null,
            tailleFichier: dalle.size,
            tailleImage: getTaille(dalle.computedMetadata.size),
            compression: dalle.computedMetadata.compression,
            epsg: dalle.computedMetadata.projection.code,
            bandes: getBandes(dalle.computedMetadata.bands),
            open: true,
            focale: livrable.focale || null
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
