#!/usr/bin/env node
/* eslint-disable import/first, import/order */
/* eslint-disable no-await-in-loop */

import * as dotenv from 'dotenv'

dotenv.config()

import process from 'node:process'
import mongo from '../server/util/mongo.js'
import {generateEditorKey} from '../server/util/generate-key.js'

if (process.env.RUN_MIGRATION_KEY !== '1') {
  process.exit(0)
}

await mongo.connect()

const projets = await mongo.db.collection('projets').find().toArray()

for (const projet of projets) {
  await generateEditorKey(projet._id)
  console.log(`Clé ajoutée au projet : ${projet.nom}`)
}

await mongo.disconnect()

