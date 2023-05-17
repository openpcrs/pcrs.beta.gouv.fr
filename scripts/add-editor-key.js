#!/usr/bin/env node
/* eslint-disable no-await-in-loop */

import mongo from '../server/util/mongo.js'
import {generateEditorKey} from '../server/util/generate-key.js'

await mongo.connect()

const projets = await mongo.db.collection('projets').find().toArray()

for (const projet of projets) {
  await generateEditorKey(projet._id)
  console.log(`Clé ajoutée au projet : ${projet.nom}`)
}

await mongo.disconnect()

