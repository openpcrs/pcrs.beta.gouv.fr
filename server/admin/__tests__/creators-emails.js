import test from 'ava'
import {MongoMemoryServer} from 'mongodb-memory-server'
import mongo from '../../util/mongo.js'
import {addCreator, deleteCreator, getCreators, updateCreator} from '../creators-emails.js'

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
  await mongo.db.collection('creators-emails').deleteMany()
})

test.serial('Create creator: valid', async t => {
  const creator = await addCreator({
    nom: 'Createur',
    email: 'createur@mail.com'
  })

  t.is(creator.nom, 'Createur')
  t.is(creator.email, 'createur@mail.com')
  t.is(creator._created, creator._updated)
})

test.serial('Create creator: email not valid', async t => {
  await t.throwsAsync(async () => addCreator({
    nom: 'Createur',
    email: 'create.com'
  }), {message: 'Cette adresse courriel est invalide'})
})

test.serial('Get creators', async t => {
  await mongo.db.collection('creators-emails').insertOne({
    nom: 'Createur',
    email: 'createur@mail.com'
  })

  await mongo.db.collection('creators-emails').insertOne({
    nom: 'Createur2',
    email: 'createur2@mail.com'
  })

  const creators = await getCreators()

  t.is(creators.length, 2)
  t.truthy(creators[0]._id)
})

test.serial('Update creator', async t => {
  const creator = await mongo.db.collection('creators-emails').insertOne({
    nom: 'Createur',
    email: 'createur@mail.com'
  })

  const updatedCreator = await updateCreator(
    creator.insertedId,
    {nom: 'Créatrice'}
  )

  t.is(updatedCreator.nom, 'Créatrice')
  t.truthy(updatedCreator._updated)
})

test.serial('Update creator / invalid mail', async t => {
  const creator = await mongo.db.collection('creators-emails').insertOne({
    nom: 'Créateur',
    email: 'createur@mail.com'
  })

  await t.throwsAsync(async () => updateCreator(creator.insertedId, {email: 'email@pasvalide'}))
})

test.serial('Update creator / empty mail', async t => {
  const creator = await mongo.db.collection('creators-emails').insertOne({
    nom: 'Créateur',
    email: 'createur@mail.com'
  })

  await t.throwsAsync(async () => updateCreator(creator.insertedId, {email: ''}))
})

test.serial('Delete creator', async t => {
  const creator = await mongo.db.collection('creators-emails').insertOne({
    nom: 'Créateur',
    email: 'createur@mail.com'
  })

  await mongo.db.collection('creators-emails').insertOne({
    nom: 'Créatrice',
    email: 'creatrice@mail.com'
  })

  const deletedCreator = await deleteCreator(creator.insertedId)
  const allCreators = await mongo.db.collection('creators-emails').find().toArray()

  t.true(deletedCreator)
  t.falsy(allCreators.find(a => a.nom === 'Créateur'))
  t.truthy(allCreators.find(a => a.nom === 'Créatrice'))
  t.is(allCreators.length, 1)
})
