#!/usr/bin/env node
/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */

import process from 'node:process'
import path from 'node:path'
import {readdir, readFile, writeFile} from 'node:fs/promises'
import yaml from 'js-yaml'
import Joi from 'joi'
import {createGeometryBuilder} from '../lib/build-geometry.js'

const pcrsFolder = './data'

const acteursSchema = Joi.object().keys({
  siren: Joi.number().required(),
  nom: Joi.string(),
  interlocuteur: Joi.string(),
  mail: Joi.string().email(),
  telephone: Joi.string().pattern(/^((\+)33|0|0033)[1-9](\d{2}){4}$/),
  role: Joi.valid(
    'aplc',
    'financeur',
    'diffuseur',
    'presta_vol',
    'presta_lidar',
    'controleur'
  ),
  finance_part_perc: Joi.number(),
  finance_part_euro: Joi.number()
})

const etapesSchema = Joi.object().keys({
  statut: Joi.valid(
    'investigation',
    'production',
    'produit',
    'livre',
    'obsolete'
  ).required(),
  date_debut: Joi.date().allow(null)
})

const livrablesSchema = Joi.object().keys({
  nom: Joi.string().required(),
  nature: Joi.valid(
    'geotiff',
    'jpeg2000',
    'gml'
  ).required(),
  licence: Joi.valid(
    'ouverte_lo',
    'ouvert_odbl',
    'ferme'
  ).required(),
  diffusion: Joi.valid(
    'telechargement',
    'flux'
  ),
  crs: Joi.string(),
  avancement: Joi.string(),
  compression: Joi.string()
})

const subventionsSchema = Joi.object().keys({
  nom: Joi.string().required(),
  nature: Joi.valid(
    'feder',
    'cepr'
  ).required()
})

const schema = Joi.object({
  nom: Joi.string()
    .min(3)
    .required(),
  regime: Joi.valid(
    'production',
    'maj'
  ).required(),
  nature: Joi.valid(
    'vecteur',
    'raster',
    'mixte'
  ).required(),
  livrables: Joi.array().items(livrablesSchema).required(),
  acteurs: Joi.array().items(acteursSchema).required(),
  perimetres: Joi.array().required(),
  etapes: Joi.array().items(etapesSchema).required(),
  subventions: Joi.array().items(subventionsSchema).required().allow(null)
}).prefs({convert: false})

const geometryBuilder = await createGeometryBuilder()

async function buildPCRSData() {
  const projets = []
  const jsonOutputPath = new URL('../public/projets.json', import.meta.url)

  const filesList = await readdir(pcrsFolder)

  for (const fileName of filesList) {
    if (fileName.endsWith('.yaml') && fileName !== 'projet-exemple.yaml') {
      console.log(`  → Reading ${fileName}  `)
      const filePath = path.join(pcrsFolder, fileName)
      const projet = yaml.load(await readFile(filePath))

      try {
        await schema.validateAsync(projet)
      } catch (error) {
        throw new Error(error)
      }

      projet.id = fileName.slice(0, -5)
      projet.statut = (projet.etapes[projet.etapes.length - 1].statut === 'livre' ? 'livré' : projet.etapes[projet.etapes.length - 1].statut)
      projet.dateStatut = projet.etapes[projet.etapes.length - 1].date_debut
      projet.aplc = projet.acteurs.find(acteur => acteur.role === 'aplc').nom
      projet.territoires = geometryBuilder.getTerritoryName(projet.perimetres)

      projets.push(projet)
    }
  }

  await writeFile(jsonOutputPath, JSON.stringify(projets))

  const geojsonOutputPath = new URL('../public/projets.geojson', import.meta.url)

  const projetsFeatures = projets.map(projet => ({
    type: 'Feature',
    geometry: geometryBuilder.buildFromTerritories(projet.perimetres),
    properties: {
      id: projet.id,
      statut: projet.statut,
      dateStatut: projet.dateStatut,
      aplc: projet.aplc,
      nature: projet.nature
    }
  }))

  await writeFile(geojsonOutputPath, JSON.stringify({
    type: 'FeatureCollection',
    features: projetsFeatures
  }))
}

buildPCRSData().catch(error => {
  console.error(error)
  process.exit(1)
})

