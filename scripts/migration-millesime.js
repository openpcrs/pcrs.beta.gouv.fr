#!/usr/bin/env node
/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-unassigned-import */
import 'dotenv/config.js'
import mongo from '../backend/util/mongo.js'

await mongo.connect()

const projets = await mongo.db.collection('projets').find({}).toArray()

for (const projet of projets) {
  const metaPerimetre = projet.metaPerimetreMillesime || '2022'

  await mongo.db.collection('projets').updateOne(
    {_id: projet._id},
    {$set: {metaPerimetreMillesime: metaPerimetre}}
  )
}

await mongo.disconnect()
