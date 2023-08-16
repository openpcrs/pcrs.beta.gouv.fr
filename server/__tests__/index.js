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
import authRoutes from '../routes/auth.js'
import creatorsEmailsRoutes from '../routes/creators-emails.js'
import administratorsRoutes from '../routes/administrators.js'
import reportRoutes from '../routes/report.js'

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
  await mongo.db.collection('creators-emails').deleteMany({})
  await mongo.db.collection('administrators').deleteMany({})
})

const app = express()

app.use(express.json())
app.use(w(handleAuth))
app.use('/projets', projetsRoutes)
app.use('/', authRoutes)
app.use('/creators-emails', creatorsEmailsRoutes)
app.use('/administrators', administratorsRoutes)
app.use('/report', reportRoutes)
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

// Auth routes
test.serial('Get role / admin', async t => {
  const {body} = await request(app).get('/me')
    .set({Authorization: `Token ${token}`})

  t.is(body.role, 'admin')
})

// Creators-emails routes
test.serial('Get creator by id', async t => {
  const email = await mongo.db.collection('creators-emails').insertOne({nom: 'Michel', email: 'michel@mail.com'})

  const {body, status} = await request(app).get(`/creators-emails/${email.insertedId}`)
    .set({Authorization: `Token ${token}`})

  t.is(body.nom, 'Michel')
  t.deepEqual(body._id, email.insertedId.toString())
  t.is(status, 200)
})

test.serial('Get all creators', async t => {
  await mongo.db.collection('creators-emails').insertMany([
    {nom: 'Michel', email: 'michel@mail.com'},
    {nom: 'Boris', email: 'boris@mail.com'}
  ])

  const {body, status} = await request(app).get('/creators-emails')
    .set({Authorization: `Token ${token}`})

  t.is(body.length, 2)
  t.is(body[0].nom, 'Michel')
  t.is(status, 200)
})

test.serial('Add a creator', async t => {
  const {body, status} = await request(app).post('/creators-emails')
    .set({Authorization: `Token ${token}`})
    .send({nom: 'Patrick', email: 'patrick@mail.com'})

  t.is(body.nom, 'Patrick')
  t.truthy(body._id)
  t.truthy(body._created)
  t.truthy(body._updated)
  t.is(status, 200)
})

test.serial('Add a creator / invalid email', async t => {
  const {body, status} = await request(app).post('/creators-emails')
    .set({Authorization: `Token ${token}`})
    .send({nom: 'Michel', email: 'michel<at>mail.com'})

  t.is(status, 400)
  t.is(body.code, 400)
  t.is(body.message, 'Cette adresse courriel est invalide')
})

test.serial('Modify a creator', async t => {
  const creator = await mongo.db.collection('creators-emails').insertOne(
    {nom: 'Michel', email: 'michel@mail.com'}
  )

  const {body, status} = await request(app).put(`/creators-emails/${creator.insertedId}`)
    .set({Authorization: `Token ${token}`})
    .send({email: 'lemichel@mail.com'})

  t.is(status, 200)
  t.is(body.email, 'lemichel@mail.com')
  t.truthy(body._updated)
})

test.serial('Delete a creator', async t => {
  const creator = await mongo.db.collection('creators-emails').insertOne(
    {nom: 'Michel', email: 'michel@mail.com'}
  )

  const {status} = await request(app).delete(`/creators-emails/${creator.insertedId}`)
    .set({Authorization: `Token ${token}`})

  const {body} = await request(app).get('/creators-emails')
    .set({Authorization: `Token ${token}`})

  t.is(status, 204)
  t.is(body.length, 0)
})

// Administrators routes
test.serial('Get all administrators', async t => {
  await mongo.db.collection('administrators').insertMany([
    {nom: 'Premier Administrateur', email: 'admin1@mail.com', token: '1'},
    {nom: 'Deuxieme Administrateur', email: 'admin2@mail.com', token: '2'}
  ])

  const {body, status} = await request(app).get('/administrators')
    .set({Authorization: `Token ${token}`})

  t.is(status, 200)
  t.is(body.length, 2)
  t.is(body[0].nom, 'Premier Administrateur')
})

test.serial('Add administrator / invalid email', async t => {
  const {body, status} = await request(app).post('/administrators')
    .set({Authorization: `Token ${token}`})
    .send({nom: 'Nouvel Admin', email: 'admin<at>mail.com'})

  t.is(status, 400)
  t.is(body.code, 400)
  t.is(body.message, 'Cette adresse courriel est invalide')
})

test.serial('Modify an administrator', async t => {
  const administrator = await mongo.db.collection('administrators').insertOne(
    {nom: 'Nouvel Admin', email: 'admin@mail.com'}
  )

  const {body, status} = await request(app).put(`/administrators/${administrator.insertedId}`)
    .set({Authorization: `Token ${token}`})
    .send({nom: 'Ancien Admin'})

  t.is(status, 200)
  t.is(body.nom, 'Ancien Admin')
  t.truthy(body._updated)
})

test.serial('Delete an administrator', async t => {
  const administrator = await mongo.db.collection('administrators').insertOne(
    {nom: 'Nouvel Admin', email: 'admin@mail.com'}
  )

  const {status} = await request(app).delete(`/administrators/${administrator.insertedId}`)
    .set({Authorization: `Token ${token}`})

  const {body} = await request(app).get('/administrators')
    .set({Authorization: `Token ${token}`})

  t.is(status, 204)
  t.is(body.length, 0)
})

// Report route
test.serial('Get admin report', async t => {
  await request(app).post('/projets')
    .set({Authorization: `Token ${token}`})
    .send({...validProjet})

  const {body} = await request(app).get('/report')
    .set({Authorization: `Token ${token}`})

  t.is(body.length, 1)
  t.is(body._created, body._updated)
})
