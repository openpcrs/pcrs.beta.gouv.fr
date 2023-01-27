#!/usr/bin/env node
/* eslint-disable no-await-in-loop */

import process from 'node:process'
import path from 'node:path'
import {readdir, readFile, writeFile} from 'node:fs/promises'
import yaml from 'js-yaml'
import {createGeometryBuilder} from '../lib/build-geometry.js'

const pcrsFolder = './data'

const REQUIRED_FIELDS = {
  keys: [
    'nom',
    'regime',
    'nature',
    'livrables',
    'acteurs',
    'perimetres',
    'etapes',
    'subventions'
  ],
  etapes: [
    'statut',
    'date_debut'
  ],
  livrables: [
    'nom',
    'nature',
    'licence'
  ],
  acteurs: [
    'siren'
  ]
}

function validateField(entry, requiredFields) {
  if (requiredFields.some(field => !Object.keys(entry).includes(field))) {
    throw new Error('Tous les champs obligatoires ne sont pas présent dans ce fichier')
  }
}

function validateFields(fields, requiredFields) {
  for (const key of fields) {
    validateField(key, requiredFields)
  }
}

function validateProjetPCRS(entry) {
  validateField(entry, REQUIRED_FIELDS.keys)
  validateFields(entry.etapes, REQUIRED_FIELDS.etapes)
  validateFields(entry.livrables, REQUIRED_FIELDS.livrables)
  validateFields(entry.acteurs, REQUIRED_FIELDS.acteurs)
}

const geometryBuilder = await createGeometryBuilder()

async function buildPCRSData() {
  const projets = []
  const jsonOutputPath = new URL('../public/projets.json', import.meta.url)

  const filesList = await readdir(pcrsFolder)

  for (const fileName of filesList) {
    if (fileName.endsWith('.yaml') && fileName !== 'projet-exemple.yaml') {
      console.log(`  → Reading ${fileName}  `)
      const filePath = path.join(pcrsFolder, fileName)
      const projet = yaml.load(await readFile(filePath))

      validateProjetPCRS(projet)

      projet.id = fileName.slice(0, -5)
      projet.statut = (projet.etapes[projet.etapes.length - 1].statut === 'livre' ? 'livré' : projet.etapes[projet.etapes.length - 1].statut)
      projet.dateStatut = projet.etapes[projet.etapes.length - 1].date_debut
      projet.aplc = projet.acteurs.find(acteur => acteur.role === 'aplc').nom
      projet.territoires = geometryBuilder.getTerritoryName(projet.perimetres)

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

