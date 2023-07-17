import createError from 'http-errors'
import {pick} from 'lodash-es'
import {nanoid} from 'nanoid'
import mongo from '../util/mongo.js'
import {validateEmail} from '../auth/pin-code/index.js'
import {sendMail} from '../util/sendmail.js'
import {formatEmail} from './email-template.js'

export async function getAdministrators() {
  return mongo.db.collection('administrators').find().toArray()
}

export async function getAdministratorByToken(token) {
  return mongo.db.collection('administrators').findOne({token})
}

export async function getAdministratorById(adminId) {
  adminId = mongo.parseObjectId(adminId)

  const administrator = await mongo.db.collection('administrators').findOne({_id: adminId})

  if (!administrator) {
    throw createError(404, 'Cet identifiant est introuvable')
  }

  return administrator
}

export async function addAdministrator(administrator) {
  if (!validateEmail(administrator.email)) {
    throw createError(400, 'Cette adresse courriel est invalide')
  }

  mongo.decorateCreation(administrator)

  administrator.token = nanoid()

  const emailContent = formatEmail({token: administrator.token, userEmail: administrator.email})

  try {
    await mongo.db.collection('administrators').insertOne(administrator)
    await sendMail(emailContent, administrator.email)
  } catch (error) {
    if (error.message.includes('E11000')) {
      throw createError(409, 'Cette adresse courriel est déjà dans la liste.')
    }

    throw error
  }

  return administrator
}

export async function updateAdministrator(adminId, update) {
  const changes = pick(update, ['email', 'nom'])
  adminId = mongo.parseObjectId(adminId)

  mongo.decorateUpdate(changes)

  const {value} = await mongo.db.collection('administrators').findOneAndUpdate(
    {_id: adminId},
    {$set: {...changes}},
    {returnDocument: 'after'}
  )

  if (!value) {
    throw createError(404, 'Cet identifiant est introuvable')
  }

  return value
}

export async function deleteAdministrator(adminId) {
  adminId = mongo.parseObjectId(adminId)

  const deleted = await mongo.db.collection('administrators').deleteOne({_id: adminId})

  return Boolean(deleted)
}

