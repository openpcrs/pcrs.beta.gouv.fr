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

import {getProjet, getProjets, createProjet, deleteProjet, updateProjet, getProjetsGeojson, expandProjet, filterSensitiveFields, checkEditorKey} from './projets.js'
import {exportLivrablesAsCSV, exportProjetsAsCSV, exportSubventionsAsCSV, exportToursDeTableAsCSV} from '../lib/export/csv.js'
import {sendPinCodeMail, checkPinCodeValidity} from './util/email/pin-code-strategie.js'

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

async function checkRole(req) {
  if (!req.get('Authorization') || !req.get('Authorization').startsWith('Token ')) {
    throw createError(401, 'Cette action nécessite une authentification')
  }

  const token = req.get('Authorization').slice(6)
  const creationToken = await mongo.db.collection('projets-admins').findOne({token})
  const editionToken = await mongo.db.collection('projets').findOne({editorKey: token})

  if (creationToken) {
    if (!creationToken.codeEdition) {
      await mongo.db.collection('projets-admins').updateOne(
        {_id: creationToken._id},
        {$set: {status: 'used'}}
      )
    }

    req.role = 'creator'

    return req
  }

  if (editionToken) {
    req.role = 'editor'

    return req
  }

  if (token === ADMIN_TOKEN) {
    req.role = 'admin'

    return req
  }

  return false
}

async function ensureAdmin(req, res, next) {
  const role = await checkRole(req)

  if (!role) {
    throw createError(403, 'Authentification refusée')
  }

  next()
}

server.param('projetId', w(async (req, res, next) => {
  const {projetId} = req.params
  const projet = await getProjet(projetId, req)

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
    const token = req.get('Authorization').slice(6)
    const isAuthorized = await checkEditorKey(expandedProjet._id, token)

    if (isAuthorized) {
      res.send(expandedProjet)
    } else {
      res.send(filterSensitiveFields(expandedProjet))
    }
  }))
  .delete(w(ensureAdmin), w(async (req, res) => {
    await deleteProjet(req.projet._id)
    res.sendStatus(204)
  }))
  .put(w(ensureAdmin), w(async (req, res) => {
    const token = req.get('Authorization').slice(6)

    if (!token) {
      throw createError(401, 'Code d’édition non valide')
    }

    const isEditor = await checkEditorKey(req.projet._id, token)

    if (!isEditor) {
      throw createError(401, 'Le code d’édition ne correspond pas au projet')
    }

    const projet = await updateProjet(req.projet._id, req.body)
    const expandedProjet = expandProjet(projet)

    res.send(expandedProjet)
  }))

server.route('/projets')
  .get(w(async (req, res) => {
    const projets = await getProjets()
    const expandedProjets = projets.map(p => expandProjet(p))
    const token = req.get('Authorization').slice(6)
    const filteredProjets = await Promise.all(expandedProjets.map(async p => {
      const isAdmin = await checkEditorKey(p, token)

      if (isAdmin) {
        return p
      }

      return filterSensitiveFields(p)
    }))

    res.send(filteredProjets)
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

server.route('/ask-code/:email')
  .post(w(async (req, res) => {
    await sendPinCodeMail(req.params.email)

    res.status(201).send('ok')
  }))

server.route('/check-code')
  .post(w(async (req, res) => {
    const validToken = await checkPinCodeValidity(req.body)

    if (validToken) {
      res.send({token: validToken})
    } else {
      res.status(401).send()
    }
  }))

server.route('/me')
  .get(w(ensureAdmin), w(async (req, res) => {
    res.send({role: req.role})
  }))

server.use(errorHandler)

server.get('*', (req, res) => {
  nextHandle(req, res)
})

server.listen(port, () => {
  console.log(`Go to http://localhost:${port} !`)
})
