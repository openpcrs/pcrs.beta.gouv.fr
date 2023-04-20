#!/usr/bin/env node
/* eslint-disable import/first, import/order */
/* eslint-disable no-await-in-loop */

import * as dotenv from 'dotenv'

dotenv.config()

import process from 'node:process'
import mongo from '../server/util/mongo.js'

if (process.env.RUN_MIGRATION !== '1') {
  process.exit(0)
}

await mongo.connect()

const projets = await mongo.db.collection('projets').find().toArray()

for (const projet of projets) {
  const updatedLivrables = projet.livrables.map(livrable => {
    if (livrable.diffusion === 'flux') {
      return {
        ...livrable,
        diffusion: 'wms',
        publication: 'ftp'
      }
    }

    if (livrable.diffusion === 'telechargement') {
      return {
        ...livrable,
        diffusion: null,
        publication: 'ftp'
      }
    }

    return livrable
  })

  await mongo.db.collection('projets').updateOne(
    {_id: projet._id},
    {$set: {livrables: updatedLivrables}}
  )
}

await mongo.disconnect()

