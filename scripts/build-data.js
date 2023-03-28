#!/usr/bin/env node

import process from 'node:process'
import {writeFile} from 'node:fs/promises'
import {buildGeometryFromTerritoires} from '../lib/territoires.js'
import mongo from '../server/util/mongo.js'

async function buildPCRSData() {
  await mongo.connect()

  const projets = await mongo.db.collection('projets').find().toArray()

  const geojsonOutputPath = new URL('../public/projets.geojson', import.meta.url)

  const projetsFeatures = await Promise.all(projets.map(async projet => ({
    type: 'Feature',
    geometry: await buildGeometryFromTerritoires(projet.perimetres),
    properties: {
      _id: projet._id,
      nom: projet.nom,
      statut: projet.etapes[projet.etapes.length - 1].statut,
      dateStatut: projet.etapes[projet.etapes.length - 1].date_debut,
      aplc: projet.acteurs.find(acteur => acteur.role === 'aplc')?.nom || null,
      nature: projet.nature
    }
  })))

  await writeFile(geojsonOutputPath, JSON.stringify({
    type: 'FeatureCollection',
    features: projetsFeatures
  }))

  mongo.disconnect()
}

buildPCRSData().catch(error => {
  console.error(error)
  process.exit(1)
})

