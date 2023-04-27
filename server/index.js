#!/usr/bin/env node

/* eslint-disable import/first */
/* eslint-disable import/order */

import * as dotenv from 'dotenv'

dotenv.config()

import process from 'node:process'

import express from 'express'
import createError from 'http-errors'
import next from 'next'
import morgan from 'morgan'
import mongo from './util/mongo.js'
import errorHandler from './util/error-handler.js'
import w from './util/w.js'

import {getProjet, getProjets, createProjet, deleteProjet, updateProjet, getProjetsGeojson, expandProjet} from './projets.js'
import {exportLivrablesAsCSV, exportProjetsAsCSV, exportSubventionsAsCSV, exportToursDeTableAsCSV} from '../lib/export/csv.js'

const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'
const {ADMIN_TOKEN} = process.env

const server = express()
const nextApp = next({dev})
const nextHandle = nextApp.getRequestHandler()

await nextApp.prepare()
await mongo.connect()

server.use(express.json())

if (dev) {
  server.use(morgan('dev'))
}

if (!ADMIN_TOKEN) {
  throw new Error('Le serveur ne peut pas démarrer car ADMIN_TOKEN n\'est pas défini')
}

function ensureAdmin(req, res, next) {
  if (!req.get('Authorization') || !req.get('Authorization').startsWith('Token ')) {
    throw createError(401, 'Cette action nécessite une authentification')
  }

  if (req.get('Authorization').slice(6) !== ADMIN_TOKEN) {
    throw createError(403, 'Authentification refusée')
  }

  next()
}

server.param('projetId', w(async (req, res, next) => {
  const {projetId} = req.params
  const projet = await getProjet(projetId)

  if (!projet) {
    throw createError(404, 'L’identifiant de projet demandé n’existe pas')
  }

  req.projet = projet
  next()
}))

// Pre-warm underlying cache
await getProjetsGeojson()

server.route('/projets/geojson')
  .get(w(async (req, res) => {
    const projetsGeojson = await getProjetsGeojson()
    res.send(projetsGeojson)
  }))

server.route('/projets/:projetId')
  .get(w(async (req, res) => {
    const expandedProjet = expandProjet(req.projet)
    res.send(expandedProjet)
  }))
  .delete(w(ensureAdmin), w(async (req, res) => {
    await deleteProjet(req.projet._id)
    res.sendStatus(204)
  }))
  .put(w(ensureAdmin), w(async (req, res) => {
    const projet = await updateProjet(req.projet._id, req.body)
    const expandedProjet = expandProjet(projet)

    res.send(expandedProjet)
  }))

server.route('/projets')
  .get(w(async (req, res) => {
    const projets = await getProjets()
    const expandedProjets = projets.map(p => expandProjet(p))

    res.send(expandedProjets)
  }))
  .post(w(ensureAdmin), w(async (req, res) => {
    const projet = await createProjet(req.body)
    const expandedProjet = expandProjet(projet)

    res.status(201).send(expandedProjet)
  }))

server.route('/data/projets.csv')
  .get(w(async (req, res) => {
    const projetsCSVFile = await exportProjetsAsCSV(req.query.includesWkt === '1')

    res.attachment('projets.csv').type('csv').send(projetsCSVFile)
  }))

server.route('/data/livrables.csv')
  .get(w(async (req, res) => {
    const livrablesCSVFile = await exportLivrablesAsCSV()

    res.attachment('livrables.csv').type('csv').send(livrablesCSVFile)
  }))

server.route('/data/tours-de-table.csv')
  .get(w(async (req, res) => {
    const toursDeTableCSVFile = await exportToursDeTableAsCSV()

    res.attachment('tours-de-table.csv').type('csv').send(toursDeTableCSVFile)
  }))

server.route('/data/subventions.csv')
  .get(w(async (req, res) => {
    const subventionsCSVFile = await exportSubventionsAsCSV()

    res.attachment('subventions.csv').type('csv').send(subventionsCSVFile)
  }))

server.route('/me')
  .get(w(ensureAdmin), w(async (req, res) => {
    res.send({isAdmin: true})
  }))

server.use(errorHandler)

server.get('*', (req, res) => {
  nextHandle(req, res)
})

server.listen(port, () => {
  console.log(`Go to http://localhost:${port} !`)
})
