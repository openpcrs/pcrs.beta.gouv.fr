#!/usr/bin/env node
/* eslint-disable import/no-unassigned-import */
/* eslint-disable no-await-in-loop */
import 'dotenv/config.js'
import mongo from '../backend/util/mongo.js'

await mongo.connect()

const projets = await mongo.db.collection('projets').find({}).toArray()

for (const projet of projets) {
  const updatedEtapes = projet.etapes.map(etape => {
    if (etape.statut === 'disponible') {
      return {
        ...etape,
        statut: 'realise'
      }
    }

    return {...etape}
  })

  await mongo.db.collection('projets').updateOne(
    {_id: projet._id},
    {$set: {etapes: updatedEtapes}}
  )
}

await mongo.disconnect()
