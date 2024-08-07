/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
import {keyBy} from 'lodash-es'
import mongo from '../util/mongo.js'
import {getStockage, getStockageGeoJSON, getStockageData} from '../../lib/pcrs-scanner-api.js'
import {findClosestEtape} from '../../shared/find-closest-etape.js'

async function computeStockagesList() {
  const projets = mongo.db.collection('projets').find({'livrables.stockage_id': {$ne: null}})
  const stockages = []

  for await (const prj of projets) {
    for (const liv of prj.livrables) {
      stockages.push({
        projet: prj,
        livrable: liv,
        subventions: prj.subventions,
        acteurs: prj.acteurs,
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

  for (const {projet, livrable, subventions, acteurs, refStockage} of stockages) {
    try {
      const stockageMeta = await getStockage(refStockage)

      if (!stockageMeta?.result?.raster?.envelope) {
        continue
      }

      // Calendrier du projet
      const projetStatut = findClosestEtape(projet.etapes)
      const projetCalendrier = pcrsCalendrier[projetStatut]
      const projetDateActualite = projet.etapes.find(e => e.statut === projetStatut)?.date_debut

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
          initiative: projet._id,
          dateActualite: projetDateActualite,
          calendrier: projetCalendrier,
          format: getFormat(stockageMeta.result.raster.format),
          compression: stockageMeta.result.raster.compression,
          epsg: stockageMeta.result.raster.projection.code,
          taille: stockageMeta.result.raster.sizeRasterFiles,
          recouvrement: livrable.recouvrement,
          focale: livrable.focale || null,
          subventions: [...new Set(projetSubventions)],
          acteurs: [...new Set(projetActeurs)],
          diffusionUrl: livrable.diffusion_url || null
        }
      })
    } catch {}
  }

  return {type: 'FeatureCollection', features}
}

export async function computeDallesGeoJSON() {
  const stockages = await computeStockagesList()
  const features = []

  for (const {projet, livrable, refStockage} of stockages) {
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
            idPCRS: projet._id,
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
