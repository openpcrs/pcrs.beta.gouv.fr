#!/usr/bin/env node
/* eslint-disable no-await-in-loop */

import mongo from '../server/util/mongo.js'

await mongo.connect()

const projetsWithDiffusionFlux = await mongo.db.collection('projets').find(
  {livrables: {$elemMatch: {diffusion: 'flux'}}}
).toArray()

const projetsWithDiffusionTelechargement = await mongo.db.collection('projets').find(
  {livrables: {$elemMatch: {diffusion: 'telechargement'}}}
).toArray()

for (const projet of projetsWithDiffusionTelechargement) {
  console.log('Modification du projet : ' + projet.nom)
  await mongo.db.collection('projets').findOneAndUpdate(
    {livrables: {$elemMatch: {diffusion: 'telechargement'}}},
    {$set: {'livrables.$.diffusion': null, 'livrables.$.publication': 'ftp'}}
  )
}

const projets = await mongo.db.collection('projets').find().toArray()

for (const projet of projets) {
  const updatedLivrables = projet.livrables.map(livrable => {
    if (livrable.diffusion === 'flux') {
      return {
        diffusion: 'wms',
        publication: 'ftp'
      }
    }

    if (livrable.diffusion === 'telechargement') {
      return {
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

