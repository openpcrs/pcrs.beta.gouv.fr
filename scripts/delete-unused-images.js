#!/usr/bin/env node
/* eslint-disable import/no-unassigned-import */
import 'dotenv/config.js'

import process from 'node:process'
import mongo from '../backend/util/mongo.js'
import {listObjects, deleteObjects} from '../backend/util/s3.js'

await mongo.connect()

const projets = await mongo.db.collection('projets').find({}).toArray()
const imagesToDelete = []

const reutilisations = projets
  .filter(projet => projet.reutilisations)
  .flatMap(projet => projet.reutilisations)

const {Contents} = await listObjects()

// Enlève les images originales de la liste
const cleanedContent = Contents.filter(content => !content.Key.includes('originals'))

for (const content of cleanedContent) {
  // Supprime le préfixe de l'image pour n'avoir que la clé
  const cleanedKey = content.Key.replaceAll('reuses/images/resized/', '')

  if (!reutilisations.some(reutilisation => reutilisation.imageKey?.includes(cleanedKey))) {
    imagesToDelete.push(
      {Key: 'reuses/images/resized/' + cleanedKey},
      {Key: 'reuses/images/originals/' + cleanedKey}
    )
  }
}

if (imagesToDelete.length > 0) {
  try {
    const {Deleted} = await deleteObjects(imagesToDelete)
    console.log(`Successfully deleted ${Deleted.length} objects from S3 bucket. Deleted objects:`)
    console.log(Deleted.map(deleted => ` • ${deleted.Key}`).join('\n'))
  } catch (error) {
    console.error('Error deleting objects:', error)
  }
} else {
  console.log('No orphan images found.')
}

process.exit(0)

