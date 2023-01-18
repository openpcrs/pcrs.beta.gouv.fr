#!/usr/bin/env node
/* eslint-disable no-await-in-loop */

import process from 'node:process'
import path from 'node:path'
import {readdir, readFile, writeFile} from 'node:fs/promises'
import yaml from 'js-yaml'

const pcrsFolder = './data'

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

  validateField(entry, REQUIRED_FIELDS.keys)
  validateFields(entry.etapes, REQUIRED_FIELDS.etapes)
  validateFields(entry.livrables, REQUIRED_FIELDS.livrables)
  validateFields(entry.acteurs, REQUIRED_FIELDS.acteurs)
}

async function buildPCRSData() {
  const projets = []
  const outputPath = new URL('../projets.json', import.meta.url)

  const filesList = await readdir(pcrsFolder)

  for (const fileName of filesList) {
    if (fileName.endsWith('.yaml')) {
      console.log(`  → Reading ${fileName}  `)
      const filePath = path.join(pcrsFolder, fileName)
      const projet = yaml.load(await readFile(filePath))

      validateProjetPCRS(projet)

      projets.push(projet)
    }
  }

  await writeFile(outputPath, JSON.stringify(projets, null, 2))
}

buildPCRSData().catch(error => {
  console.error(error)
  process.exit(1)
})

