#!/usr/bin/env node
import process from 'node:process'

import express from 'express'
import createError from 'http-errors'
import next from 'next'
import mongo from './util/mongo.js'
import errorHandler from './util/error-handler.js'

import {getProjet, getProjets, createProjet, deleteProjet, updateProjet} from './projets.js'
import w from './util/w.js'

const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'

const app = express()
const nextApp = next({dev})
const nextHandle = nextApp.getRequestHandler()

await nextApp.prepare()
await mongo.connect()

app.use(express.json())

app.param('projetId', w(async (req, res, next) => {
  const {projetId} = req.params
  const projet = await getProjet(projetId)

  if (!projet) {
    throw createError(404, 'L’identifiant de projet demandé n’existe pas')
  }

  req.projet = projet
  next()
}))

app.route('/projets/:projetId')
  .get(w(async (req, res) => {
    res.send(req.projet)
  }))
  .delete(w(async (req, res) => {
    await deleteProjet(req.projet._id)
    res.sendStatus(204)
  }))
  .put(w(async (req, res) => {
    const projet = await updateProjet(req.projet._id, req.body)
    res.send(projet)
  }))

app.route('/projets')
  .get(w(async (req, res) => {
    const projets = await getProjets()
    res.send(projets)
  }))
  .post(w(async (req, res) => {
    const projet = await createProjet(req.body)
    res.status(201).send(projet)
  }))

app.use(errorHandler)

app.get('*', (req, res) => {
  nextHandle(req, res)
})

app.listen(port, () => {
  console.log(`Go to http://localhost:${port} !`)
})
