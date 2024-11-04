#!/usr/bin/env node
/* eslint-disable camelcase */
/* eslint-disable import/no-unassigned-import */
/* eslint-disable no-await-in-loop */
import 'dotenv/config.js'
import mongo from '../backend/util/mongo.js'

await mongo.connect()

const projets = await mongo.db.collection('projets').find({}).toArray()

for (const projet of projets) {
  const updatedLivrable = projet.livrables.map(livrable => {
    if (livrable.recouvrement || livrable.recouvrement === null) {
      livrable.recouvr_lat = livrable.recouvrement
      livrable.recouvr_lon = livrable.recouvrement

      delete livrable.recouvrement
    }

    return livrable
  })

  await mongo.db.collection('projets').updateOne(
    {_id: projet._id},
    {$set: {livrables: updatedLivrable}}
  )
}

await mongo.disconnect()
