#!/usr/bin/env node
/* eslint-disable no-await-in-loop */

import process from 'node:process'
import path from 'node:path'
import {readdir, readFile, writeFile} from 'node:fs/promises'
import yaml from 'js-yaml'
import validatePCRSFile from '../lib/pcrs-validator.js'

const pcrsFolder = './data'

async function buildPCRSData() {
  const projets = []
  const outputPath = new URL('../projets.json', import.meta.url)

  const filesList = await readdir(pcrsFolder)

  for (const fileName of filesList) {
    if (fileName.endsWith('.yaml')) {
      console.log(`  → Reading ${fileName}  `)
      const filePath = path.join(pcrsFolder, fileName)
      const projet = yaml.load(await readFile(filePath))

      validatePCRSFile(projet)

      projets.push(projet)
    }
  }

  await writeFile(outputPath, JSON.stringify(projets, null, 2))
}

buildPCRSData().catch(error => {
  console.error(error)
  process.exit(1)
})

