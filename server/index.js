#!/usr/bin/env node
import process from 'node:process'

import * as dotenv from 'dotenv'

import express from 'express'
import createError from 'http-errors'
import next from 'next'
import mongo from './util/mongo.js'
import errorHandler from './util/error-handler.js'
import w from './util/w.js'

import {getProjet, getProjets, createProjet, deleteProjet, updateProjet} from './projets.js'

dotenv.config()

const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'
const {ADMIN_TOKEN} = process.env

const server = express()
const nextApp = next({dev})
const nextHandle = nextApp.getRequestHandler()

await nextApp.prepare()
await mongo.connect()

server.use(express.json())

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

server.route('/projets/:projetId')
  .get(w(async (req, res) => {
    res.send(req.projet)
  }))
  .delete(w(ensureAdmin), w(async (req, res) => {
    await deleteProjet(req.projet._id)
    res.sendStatus(204)
  }))
  .put(w(ensureAdmin), w(async (req, res) => {
    const projet = await updateProjet(req.projet._id, req.body)
    res.send(projet)
  }))

server.route('/projets')
  .get(w(async (req, res) => {
    const projets = await getProjets()
    res.send(projets)
  }))
  .post(w(ensureAdmin), w(async (req, res) => {
    const projet = await createProjet(req.body)
    res.status(201).send(projet)
  }))

server.use(errorHandler)

server.get('*', (req, res) => {
  nextHandle(req, res)
})

server.listen(port, () => {
  console.log(`Go to http://localhost:${port} !`)
})
