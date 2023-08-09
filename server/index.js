#!/usr/bin/env node

/* eslint-disable import/first */
/* eslint-disable import/order */

import * as dotenv from 'dotenv'

dotenv.config()

import process from 'node:process'

import express from 'express'
import next from 'next'
import morgan from 'morgan'
import createError from 'http-errors'

import mongo from './util/mongo.js'
import errorHandler from './util/error-handler.js'
import w from './util/w.js'

import {handleAuth, ensureAdmin, parseToken} from './auth/middleware.js'

import {getProjetsGeojson} from './projets.js'
import dataRoutes from './routes/data.js'
import projetsRoutes from './routes/projets.js'
import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import {addAdministrator, getAdministrators, updateAdministrator, deleteAdministrator, getAdministratorById, isSelfDeleting} from './admin/administrators.js'

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

server.param('adminId', w(async (req, res, next) => {
  const {adminId} = req.params
  const administrator = await getAdministratorById(adminId, req)

  if (!administrator) {
    throw createError(404, 'Cet administrateur n’existe pas')
  }

  req.administrator = administrator
  next()
}))

// Pre-warm underlying cache
await getProjetsGeojson()

server.use(w(handleAuth))
server.use('/', dataRoutes)
server.use('/', projetsRoutes)
server.use('/', authRoutes)
server.use('/', adminRoutes)

server.route('/administrators/:adminId')
  .all(w(ensureAdmin))
  .get(w(async (req, res) => {
    res.send(req.administrator)
  }))
  .delete(w(async (req, res) => {
    const token = await parseToken(req)

    await isSelfDeleting(req.params.adminId, token)
    await deleteAdministrator(req.params.adminId)

    res.sendStatus(204)
  }))
  .put(w(async (req, res) => {
    const administrator = await updateAdministrator(req.params.adminId, req.body)

    res.send(administrator)
  }))

server.route('/administrators')
  .all(w(ensureAdmin))
  .get(w(async (req, res) => {
    const administrators = await getAdministrators()

    res.send(administrators)
  }))
  .post(w(async (req, res) => {
    const administrator = await addAdministrator(req.body)

    res.send(administrator)
  }))

server.use(errorHandler)

server.get('*', (req, res) => {
  nextHandle(req, res)
})

server.listen(port, () => {
  console.log(`Go to http://localhost:${port} !`)
})
