#!/usr/bin/env node

/* eslint-disable import/first */
/* eslint-disable import/order */

import * as dotenv from 'dotenv'

dotenv.config()

import process from 'node:process'

import express from 'express'
import next from 'next'
import morgan from 'morgan'

import mongo from './util/mongo.js'
import errorHandler from './util/error-handler.js'
import w from './util/w.js'

import {handleAuth} from './auth/middleware.js'

import {getProjetsGeojson} from './projets.js'
import dataRoutes from './routes/data.js'
import projetsRoutes from './routes/projets.js'
import authRoutes from './routes/auth.js'
import creatorsEmailsRoutes from './routes/creators-emails.js'
import administratorsRoutes from './routes/administrators.js'

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
server.use('/data', dataRoutes)
server.use('/projets', projetsRoutes)
server.use('/', authRoutes)
server.use('/creators-emails', creatorsEmailsRoutes)
server.use('/administrators', administratorsRoutes)

server.use(errorHandler)

server.get('*', (req, res) => {
  nextHandle(req, res)
})

server.listen(port, () => {
  console.log(`Go to http://localhost:${port} !`)
})
