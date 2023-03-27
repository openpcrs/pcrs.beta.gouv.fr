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

for (const projet of projetsWithDiffusionFlux) {
  console.log('Modification du projet : ' + projet.nom)
  await mongo.db.collection('projets').findOneAndUpdate(
    {livrables: {$elemMatch: {diffusion: 'flux'}}},
    {$set: {'livrables.$.diffusion': 'wms', 'livrables.$.publication': 'ftp'}}
  )
}

await mongo.disconnect()

