import test from 'ava'
import {MongoMemoryServer} from 'mongodb-memory-server'
import express from 'express'
import request from 'supertest'
import dotenv from 'dotenv'
import mongo from '../util/mongo.js'
import w from '../util/w.js'

import {handleAuth} from '../auth/middleware.js'
import errorHandler from '../util/error-handler.js'

import projetsRoutes from '../routes/projets.js'

import validProjet from '../mock/mock-valid-projet.js'
import invalidProjet from '../mock/mock-invalid-projet.js'

dotenv.config()

const token = process.env.ADMIN_TOKEN

let mongod

test.before('Start server', async () => {
  mongod = await MongoMemoryServer.create()
  await mongo.connect(mongod.getUri())
})

test.after.always('Cleanup', async () => {
  await mongo.disconnect()
  await mongod.stop()
})

test.beforeEach('Clean database', async () => {
  await mongo.db.collection('projets').deleteMany({})
})

const app = express()

app.use(express.json())
app.use(w(handleAuth))
app.use('/projets', projetsRoutes)
app.use(errorHandler)

// Projets routes
test.serial('Get projets without admin token', async t => {
  await mongo.db.collection('projets').insertOne({...validProjet})

  const {body, status} = await request(app).get('/projets')

  t.is(body[0].nom, 'Nom du pcrs')
  t.is(status, 200)
  t.truthy(body[0]._id)
})

test.serial('Create a projet with admin token', async t => {
  const {body} = await request(app).post('/projets')
    .set({Authorization: `Token ${token}`})
    .send(validProjet)

  t.is(body.nom, 'Nom du pcrs')
  t.is(body.creator, 'admin')
  t.is(body.etapes.length, 2)
  t.truthy(body.editorKey)
})

test.serial('Create a projet with invalid token', async t => {
  const {body} = await request(app).post('/projets')
    .set({Authorization: 'Token mauvaistoken'})
    .send({...validProjet})

  t.is(body.code, 403)
  t.is(body.message, 'Jeton invalide')
})

test.serial('Create invalid projet', async t => {
  const {body} = await request(app).post('/projets')
    .set({Authorization: `Token ${token}`})
    .send(invalidProjet)

  t.is(body.code, 400)
  t.is(body.message, 'Invalid payload')
  t.is(body.validationErrors.length, 14)
})

test.serial('Delete a projet', async t => {
  const projet = await mongo.db.collection('projets').insertOne({...validProjet})

  const {status} = await request(app).delete(`/projets/${projet.insertedId}`)
    .set({Authorization: `Token ${token}`})

  const deletedProjet = await mongo.db.collection('projets').findOne({_id: projet.insertedId})

  t.is(status, 204)
  t.truthy(deletedProjet._deleted)
  t.is(deletedProjet.nom, 'Nom du pcrs')
})

test.serial('Update a projet', async t => {
  const projet = await mongo.db.collection('projets').insertOne({...validProjet})

  const {body, status} = await request(app).put(`/projets/${projet.insertedId}`)
    .set({Authorization: `Token ${token}`})
    .send({nom: 'Nouveau nom'})

  t.is(status, 200)
  t.is(body.nom, 'Nouveau nom')
})
