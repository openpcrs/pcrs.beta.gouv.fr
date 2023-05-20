#!/usr/bin/env node
/* eslint-disable no-await-in-loop */

import mongo from '../server/util/mongo.js'
import {renewEditorKey} from '../server/projets.js'

await mongo.connect()

const projets = await mongo.db.collection('projets').find({editorKey: {$exists: false}}).toArray()

for (const projet of projets) {
  await renewEditorKey(projet._id)
  console.log(`Clé ajoutée au projet : ${projet.nom}`)
}

await mongo.disconnect()
