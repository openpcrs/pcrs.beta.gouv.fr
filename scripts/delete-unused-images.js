#!/usr/bin/env node
/* eslint-disable import/no-unassigned-import */
import 'dotenv/config.js'

import process from 'node:process'
import {S3, ListObjectsV2Command, DeleteObjectsCommand} from '@aws-sdk/client-s3'
import mongo from '../backend/util/mongo.js'

await mongo.connect()

const {S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET, S3_REGION, S3_ENDPOINT, S3_PREFIX} = process.env
const client = new S3({
  region: S3_REGION,
  endpoint: S3_ENDPOINT,
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY
  }
})

const projets = await mongo.db.collection('projets').find({}).toArray()
const imagesToDelete = []

const reutilisations = projets
  .filter(projet => projet.reutilisations)
  .flatMap(projet => projet.reutilisations)

const {Contents} = await client.send(new ListObjectsV2Command({
  Bucket: S3_BUCKET,
  Prefix: S3_PREFIX
}))

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
  const deleteCommand = new DeleteObjectsCommand({
    Bucket: S3_BUCKET,
    Delete: {
      Objects: imagesToDelete
    }
  })

  try {
    const {Deleted} = await client.send(deleteCommand)
    console.log(`Successfully deleted ${Deleted.length} objects from S3 bucket. Deleted objects:`)
    console.log(Deleted.map(deleted => ` • ${deleted.Key}`).join('\n'))
  } catch (error) {
    console.error('Error deleting objects:', error)
  }
} else {
  console.log('No orphan images found.')
}

process.exit(0)

