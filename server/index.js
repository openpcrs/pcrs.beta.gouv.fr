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

import {handleAuth, ensureAdmin} from './auth/middleware.js'

import {getProjetsGeojson} from './projets.js'
import {addCreator, deleteCreator, getCreatorById, getCreators, updateCreator} from './admin/creators-emails.js'
import {getUpdatedProjets} from './admin/reports.js'
import exportCSVRouter from './routes/data.js'
import projetsRouter from './routes/projets.js'
import exportAuthRouter from './routes/auth.js'

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

// Pre-warm underlying cache
await getProjetsGeojson()

server.use(w(handleAuth))
server.use('/', exportCSVRouter)
server.use('/', projetsRouter)
server.use('/', exportAuthRouter)

server.route('/creator-email/:emailId')
  .get(w(ensureAdmin), w(async (req, res) => {
    const email = await getCreatorById(req.params.emailId)

    if (!email) {
      throw createError(404, 'Email introuvable')
    }

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

server.route('/report')
  .get(w(ensureAdmin), w(async (req, res) => {
    const since = new Date(req.query.since)
    const validDate = Number.isNaN(since.valueOf()) ? new Date('2010-01-01') : since

    const report = await getUpdatedProjets(validDate)
    res.send(report)
  }))

server.use(errorHandler)

server.get('*', (req, res) => {
  nextHandle(req, res)
})

server.listen(port, () => {
  console.log(`Go to http://localhost:${port} !`)
})
