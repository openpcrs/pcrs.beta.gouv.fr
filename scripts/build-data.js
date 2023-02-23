#!/usr/bin/env node
/* eslint-disable no-await-in-loop */

import process from 'node:process'
import path from 'node:path'
import {readdir, readFile, writeFile} from 'node:fs/promises'
import yaml from 'js-yaml'
import {createGeometryBuilder} from '../lib/build-geometry.js'
import {validateCreation} from '../lib/validate-projet.js'

const projetsDirectory = './data'

const geometryBuilder = await createGeometryBuilder()

async function buildPCRSData() {
  const projets = []
  const jsonOutputPath = new URL('../public/projets.json', import.meta.url)

  const filesList = await readdir(projetsDirectory)

  for (const fileName of filesList) {
    if (fileName.endsWith('.yaml') && fileName !== 'projet-exemple.yaml') {
      console.log(`  → Reading ${fileName}  `)
      const filePath = path.join(projetsDirectory, fileName)
      const projet = yaml.load(await readFile(filePath))

      const {error} = validateCreation(projet)

      if (error) {
        throw new Error(error)
      }

      projet.id = fileName.slice(0, -5)
      projet.statut = projet.etapes[projet.etapes.length - 1].statut
      projet.dateStatut = projet.etapes[projet.etapes.length - 1].date_debut
      projet.aplc = projet.acteurs.find(acteur => acteur.role === 'aplc')?.nom || null
      projet.territoires = geometryBuilder.getTerritoriesName(projet.perimetres)

      projets.push(projet)
    }
  }

  await writeFile(jsonOutputPath, JSON.stringify(projets))

  const geojsonOutputPath = new URL('../public/projets.geojson', import.meta.url)

  const projetsFeatures = projets.map(projet => ({
    type: 'Feature',
    geometry: geometryBuilder.buildFromTerritories(projet.perimetres),
    properties: {
      id: projet.id,
      nom: projet.nom,
      statut: projet.statut,
      dateStatut: projet.dateStatut,
      aplc: projet.aplc,
      nature: projet.nature
    }
  }))

  await writeFile(geojsonOutputPath, JSON.stringify({
    type: 'FeatureCollection',
    features: projetsFeatures
  }))
}

buildPCRSData().catch(error => {
  console.error(error)
  process.exit(1)
})

