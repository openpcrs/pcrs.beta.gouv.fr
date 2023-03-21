#!/usr/bin/env node
/* eslint-disable import/order */
/* eslint-disable import/first */
/* eslint-disable no-await-in-loop */

import * as dotenv from 'dotenv'

dotenv.config()

import process from 'node:process'
import path from 'node:path'
import {readdir, readFile} from 'node:fs/promises'
import yaml, {JSON_SCHEMA} from 'js-yaml'
import mongo from '../server/util/mongo.js'
import {createProjet} from '../server/projets.js'

async function projetsMigration() {
  const filesList = await readdir('./data')

  await mongo.connect()

  for (const fileName of filesList) {
    if (fileName.endsWith('.yaml') && fileName !== 'projet-exemple.yaml') {
      const filePath = path.join('./data', fileName)
      const projet = yaml.load(await readFile(filePath), {schema: JSON_SCHEMA})

      console.log('Insertion du projet ->', projet.nom)

      await createProjet(projet)
    }
  }

  console.log('\nLes projets ont bien été importés dans la base 🎉\n')

  mongo.disconnect()
}

projetsMigration().catch(error => {
  console.error(error)
  process.exit(1)
})

