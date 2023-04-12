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

if (process.env.RUN_MIGRATION !== '1') {
  process.exit(0)
}

const filesList = await readdir('./data')

await mongo.connect()

const migratedFilenames = await mongo.db.collection('yaml_migrations').distinct('filename')

for (const fileName of filesList) {
  if (!fileName.endsWith('.yaml') || fileName === 'projet-exemple.yaml' || migratedFilenames.includes(fileName)) {
    continue
  }

  const filePath = path.join('./data', fileName)
  const projet = yaml.load(await readFile(filePath), {schema: JSON_SCHEMA})

  console.log('Insertion du projet ->', projet.nom)

  const {_id} = await createProjet(projet)

  await mongo.db.collection('yaml_migrations').insertOne({
    filename: fileName,
    projetId: _id
  })
}

console.log('\nLes projets ont bien été importés dans la base 🎉\n')

mongo.disconnect()

