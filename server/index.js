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

import {handleAuth, ensureCreator, ensureProjectEditor, ensureAdmin} from './auth/middleware.js'
import {sendPinCodeEmail, checkPinCodeValidity, isAuthorizedEmail} from './auth/pin-code/index.js'

import {getProjet, getProjets, deleteProjet, updateProjet, getProjetsGeojson, expandProjet, filterSensitiveFields, createProjet} from './projets.js'
import {exportEditorKeys, exportLivrablesAsCSV, exportProjetsAsCSV, exportSubventionsAsCSV, exportToursDeTableAsCSV} from '../lib/export/csv.js'
import {addCreator, deleteCreator, getCreatorById, getCreators, updateCreator, getCreatorByEmail} from './admin/creators-emails.js'

const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'

const server = express()
const nextApp = next({dev})
const nextHandle = nextApp.getRequestHandler()

await nextApp.prepare()
await mongo.connect()

server.use(express.json())

if (dev) {
  server.use(morgan('dev'))
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

server.use(w(handleAuth))

server.route('/projets/geojson')
  .get(w(async (req, res) => {
    const projetsGeojson = await getProjetsGeojson()
    res.send(projetsGeojson)
  }))

server.route('/projets/:projetId')
  .get(w(async (req, res) => {
    const projet = expandProjet(req.projet)

    if (req.role === 'admin' || (req.role === 'editor' && req.projet._id.equals(req.canEditProjetId))) {
      return res.send(projet)
    }

    res.send(filterSensitiveFields(projet))
  }))
  .delete(w(ensureProjectEditor), w(async (req, res) => {
    await deleteProjet(req.projet._id)
    res.sendStatus(204)
  }))
  .put(w(ensureProjectEditor), w(async (req, res) => {
    const projet = await updateProjet(req.projet._id, req.body)
    const expandedProjet = expandProjet(projet)

    res.send(expandedProjet)
  }))

server.route('/projets')
  .get(w(async (req, res) => {
    const projets = await getProjets()

    res.send(projets.map(
      projet => expandProjet(filterSensitiveFields(projet))
    ))
  }))
  .post(w(ensureCreator), w(async (req, res) => {
    const projet = await createProjet(req.body, {creator: req.creator})
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

server.route('/data/editor-keys.csv')
  .get(w(ensureAdmin), w(async (req, res) => {
    const editorKeysCSVFile = await exportEditorKeys()

    res.attachment('editor-keys.csv').type('csv').send(editorKeysCSVFile)
  }))

server.route('/ask-code')
  .post(w(async (req, res) => {
    const authorizedEditorEmail = await isAuthorizedEmail(req.body.email)

    if (!authorizedEditorEmail) {
      throw createError(401, 'Cette adresse n’est pas autorisée à créer un projet')
    }

    await sendPinCodeEmail(req.body.email)

    res.status(201).send('ok')
  }))

server.route('/check-code')
  .post(w(async (req, res) => {
    const {email, pinCode} = req.body
    const validToken = await checkPinCodeValidity({email, pinCode})
    res.send({token: validToken})
  }))

server.route('/me')
  .get(w(async (req, res) => {
    if (!req.role) {
      throw createError(401, 'Jeton requis')
    }

    res.send({role: req.role})
  }))

server.route('/creator-email/:emailId')
  .get(w(ensureAdmin), w(async (req, res) => {
    const email = await getCreatorById(req.params.emailId)

    res.send(email)
  }))
  .delete(w(ensureAdmin), w(async (req, res) => {
    await deleteCreator(req.params.emailId)

    res.sendStatus(204)
  }))
  .put(w(ensureAdmin), w(async (req, res) => {
    const email = await updateCreator(req.params.emailId, req.body)

    res.send(email)
  }))

server.route('/creator-emails')
  .get(w(ensureAdmin), w(async (req, res) => {
    const emails = await getCreators()

    res.send(emails)
  }))
  .post(w(ensureAdmin), w(async (req, res) => {
    const email = await addCreator(req.body)

    res.send(email)
  }))

server.use(errorHandler)

server.get('*', (req, res) => {
  nextHandle(req, res)
})

server.listen(port, () => {
  console.log(`Go to http://localhost:${port} !`)
})
