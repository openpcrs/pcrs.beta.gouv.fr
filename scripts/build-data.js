#!/usr/bin/env node
/* eslint-disable no-await-in-loop */

import process from 'node:process'
import path from 'node:path'
import {readdir, readFile, writeFile} from 'node:fs/promises'
import yaml, {JSON_SCHEMA} from 'js-yaml'
import {buildGeometryFromTerritoires, getTerritoire} from '../lib/territoires.js'
import {validateCreation} from '../lib/projets-validator.js'

const projetsDirectory = './data'

async function buildPCRSData() {
  const projets = []
  const jsonOutputPath = new URL('../public/projets.json', import.meta.url)

  const filesList = await readdir(projetsDirectory)

  for (const fileName of filesList) {
    if (fileName.endsWith('.yaml') && fileName !== 'projet-exemple.yaml') {
      console.log(`  → Reading ${fileName}  `)
      const filePath = path.join(projetsDirectory, fileName)
      const projet = yaml.load(await readFile(filePath), {schema: JSON_SCHEMA})

      validateCreation(projet)

      projet.id = fileName.slice(0, -5)
      projet.statut = projet.etapes[projet.etapes.length - 1].statut
      projet.dateStatut = projet.etapes[projet.etapes.length - 1].date_debut
      projet.aplc = projet.acteurs.find(acteur => acteur.role === 'aplc')?.nom || null
      projet.territoires = projet.perimetres.map(perimetre => (
        getTerritoire(perimetre)
      ))

      projets.push(projet)
    }
  }

  await writeFile(jsonOutputPath, JSON.stringify(projets))

  const geojsonOutputPath = new URL('../public/projets.geojson', import.meta.url)

  const projetsFeatures = projets.map(projet => ({
    type: 'Feature',
    geometry: buildGeometryFromTerritoires(projet.perimetres),
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

