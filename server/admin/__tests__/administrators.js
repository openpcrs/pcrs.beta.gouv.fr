import test from 'ava'
import {nanoid} from 'nanoid'
import {MongoMemoryServer} from 'mongodb-memory-server'
import mongo from '../../util/mongo.js'
import {addAdministrator, deleteAdministrator, getAdministratorById, getAdministrators, isSelfDeleting, updateAdministrator} from '../administrators.js'

let mongod

test.before('Start server', async () => {
  mongod = await MongoMemoryServer.create()
  await mongo.connect(mongod.getUri())
})

test.after.always('cleanup', async () => {
  await mongo.disconnect()
  await mongod.stop()
})

test.beforeEach('Clean database', async () => {
  await mongo.db.collection('administrators').deleteMany()
})

test.serial('Create administrator: valid', async t => {
  const administrator = await addAdministrator({
    nom: 'Administrateur',
    email: 'administrateur@mail.com'
  })

  t.is(administrator.nom, 'Administrateur')
  t.is(administrator.email, 'administrateur@mail.com')
  t.truthy(administrator.token)
  t.is(administrator._created, administrator._updated)
})

test.serial('Create administrator: email not valid', async t => {
  await t.throwsAsync(async () => addAdministrator({
    nom: 'Administrateur',
    email: 'admin.com'
  }), {message: 'Cette adresse courriel est invalide'})
})

test.serial('Get administrators', async t => {
  await mongo.db.collection('administrators').insertOne({
    nom: 'Administrateur',
    email: 'administrateur@mail.com',
    token: nanoid()
  })

  await mongo.db.collection('administrators').insertOne({
    nom: 'Administrateur2',
    email: 'administrateur2@mail.com',
    token: nanoid()
  })

  const administrators = await getAdministrators()

  t.is(administrators.length, 2)
  t.falsy(administrators[0].token)
})

test.serial('Get administrator', async t => {
  const administrator = await mongo.db.collection('administrators').insertOne({
    nom: 'Administrateur',
    email: 'administrateur@mail.com',
    token: nanoid()
  })

  const foundAdministrator = await getAdministratorById(administrator.insertedId)

  t.is(foundAdministrator.nom, 'Administrateur')
  t.truthy(foundAdministrator.token)
})

test.serial('Update administrator', async t => {
  const administrator = await mongo.db.collection('administrators').insertOne({
    nom: 'Administrateur',
    email: 'administrateur@mail.com',
    token: nanoid()
  })

  const updatedAdministrator = await updateAdministrator(
    administrator.insertedId,
    {nom: 'Administratrice'}
  )

  t.is(updatedAdministrator.nom, 'Administratrice')
  t.truthy(updatedAdministrator._updated)
})

test.serial('Update administrator / invalid mail', async t => {
  const administrator = await mongo.db.collection('administrators').insertOne({
    nom: 'Administrateur',
    email: 'administrateur@mail.com',
    token: nanoid()
  })

  await t.throwsAsync(async () => updateAdministrator(administrator.insertedId, {email: 'mailPasValide'}))
})

test.serial('Delete administrator', async t => {
  const admin1 = await mongo.db.collection('administrators').insertOne({
    nom: 'Administrateur',
    email: 'administrateur@mail.com',
    token: nanoid()
  })

  await mongo.db.collection('administrators').insertOne({
    nom: 'Administrateur2',
    email: 'administrateur2@mail.com',
    token: nanoid()
  })

  const deleted = await deleteAdministrator(admin1.insertedId)
  const allAdministrators = await mongo.db.collection('administrators').find().toArray()

  t.true(deleted)
  t.falsy(allAdministrators.find(a => a.nom === 'Administrateur'))
  t.truthy(allAdministrators.find(a => a.nom === 'Administrateur2'))
  t.is(allAdministrators.length, 1)
})

test.serial('Administrator delete himself', async t => {
  const admin = await mongo.db.collection('administrators').insertOne({
    nom: 'Administrateur',
    email: 'administrateur@mail.com',
    token: 'monSuperJeton'
  })

  await t.throwsAsync(async () => isSelfDeleting(admin.insertedId, 'monSuperJeton'), {message: 'Vous ne pouvez pas supprimer votre propre accès administrateur'})
})
