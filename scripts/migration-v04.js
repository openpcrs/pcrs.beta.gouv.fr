#!/usr/bin/env node
/* eslint-disable camelcase */
/* eslint-disable no-await-in-loop */

import mongo from '../backend/util/mongo.js'

await mongo.connect()

const projets = await mongo.db.collection('projets').find({}).toArray()

function updateEtapes(etapes) {
  if (etapes.some(e => e.statut === 'prod_en_cours')) {
    if (!etapes.some(e => e.statut === 'convention_signee')) {
      etapes.splice(1, 0, {
        statut: 'convention_signee',
        date_debut: null
      })
    }

    if (!etapes.some(e => e.statut === 'marche_public_en_cours')) {
      etapes.splice(2, 0, {
        statut: 'marche_public_en_cours',
        date_debut: null
      })
    }
  }
}

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

  updateEtapes(updatedEtapes)

  await mongo.db.collection('projets').updateOne(
    {_id: projet._id},
    {$set: {etapes: updatedEtapes}}
  )
}

await mongo.disconnect()
