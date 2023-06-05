import createError from 'http-errors'
import {pick} from 'lodash-es'
import {validateEmail} from '../auth/pin-code/index.js'
import mongo from '../util/mongo.js'

export async function getCreators() {
  return mongo.db.collection('creators-emails').find().toArray()
}

export async function getCreatorByEmail(email) {
  return mongo.db.collection('creators-emails').findOne({email})
}

export async function getCreatorById(creatorId) {
  creatorId = mongo.parseObjectId(creatorId)

  const creator = await mongo.db.collection('creators-emails').findOne({_id: creatorId})

  if (!creator) {
    throw createError(404, 'Cette adresse courriel est introuvable')
  }

  return creator
}

export async function addCreator(creator) {
  if (!validateEmail(creator.email)) {
    throw createError(400, 'Cette adresse courriel est invalide')
  }

  mongo.decorateCreation(creator)

  try {
    await mongo.db.collection('creators-emails').insertOne(creator)
  } catch (error) {
    if (error.message.includes('E11000')) {
      throw createError(409, 'Cet adresse est déjà dans la liste.')
    }

    throw error
  }

  return creator
}

export async function updateCreator(creatorId, update) {
  creatorId = mongo.parseObjectId(creatorId)

  const changes = pick(update, ['email', 'nom'])

  mongo.decorateUpdate(changes)

  const {value} = await mongo.db.collection('creators-emails').findOneAndUpdate(
    {_id: creatorId},
    {$set: {...changes}},
    {returnDocument: 'after'}
  )

  if (!value) {
    throw createError(404, 'Cette adresse est introuvable')
  }

  return value
}

export async function deleteCreator(creatorId) {
  creatorId = mongo.parseObjectId(creatorId)

  const deleted = await mongo.db.collection('creators-emails').deleteOne({_id: creatorId})

  return Boolean(deleted)
}

