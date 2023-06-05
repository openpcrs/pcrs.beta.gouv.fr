#!/usr/bin/env node
/* eslint-disable import/first */
/* eslint-disable no-await-in-loop */

import * as dotenv from 'dotenv'

dotenv.config()

import mongo from '../server/util/mongo.js'
import {getAuthorizedEmails, validateEmail} from '../server/auth/pin-code/index.js'

await mongo.connect()

const emails = await getAuthorizedEmails()

for (const email of emails) {
  if (validateEmail(email)) {
    const creator = {email}

    mongo.decorateCreation(creator)

    await mongo.db.collection('creators-emails').updateOne({email: creator.email}, {$setOnInsert: {...creator}}, {upsert: true})
  }
}

console.log('Terminé !')

await mongo.disconnect()
