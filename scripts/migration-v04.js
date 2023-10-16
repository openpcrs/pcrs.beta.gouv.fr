#!/usr/bin/env node
/* eslint-disable no-await-in-loop */

import mongo from '../backend/util/mongo.js'

await mongo.connect()

const projets = await mongo.db.collection('projets').find({}).toArray()

for (const projet of projets) {
  const updatedEtapes = projet.etapes.map(etape => {
    if (etape.statut === 'production') {
      return {
        ...etape,
        statut: 'prod_en_cours'
      }
    }

    if (etape.statut === 'produit') {
      return {
        ...etape,
        statut: 'controle_en_cours'
      }
    }

    if (etape.statut === 'livre') {
      return {
        ...etape,
        statut: 'disponible'
      }
    }

    return etape
  })

  await mongo.db.collection('projets').updateOne(
    {_id: projet._id},
    {$set: {etapes: updatedEtapes}}
  )
}

await mongo.disconnect()
