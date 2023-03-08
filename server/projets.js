import createError from 'http-errors'
import {validateCreation, validateChanges} from '../lib/projets-validator.js'
import mongo from './util/mongo.js'

export async function getProjets() {
  return mongo.db.collection('projets').find().toArray()
}

export async function getProjet(projetId) {
  projetId = mongo.parseObjectId(projetId)

  if (!projetId) {
    throw createError(404, 'Le projet est introuvable')
  }

  return mongo.db.collection('projets').findOne({_id: projetId})
}

export async function createProjet(payload) {
  const projet = validateCreation(payload)

  mongo.decorateCreation(projet)

  try {
    await mongo.db.collection('projets').insertOne(projet)
  } catch (error) {
    if (error.message.includes('E11000')) {
      throw createError(409, 'Un projet avec un nom identique est déjà présent.')
    }

    throw error
  }

  return projet
}

export async function deleteProjet(projetId) {
  const deleted = await mongo.db.collection('projets').deleteOne({_id: projetId})

  if (deleted.deletedCount === 0) {
    return 'Aucun projet n’a été suprimmé'
  }

  return deleted
}

export async function updateProjet(id, payload) {
  const projet = validateChanges(payload)

  mongo.decorateUpdate(projet)

  if (Object.keys(projet).length === 0) {
    throw createError(400, 'Le contenu de la requête est invalide (aucun champ valide trouvé)')
  }

  const {value} = await mongo.db.collection('projets').findOneAndUpdate(
    {_id: mongo.parseObjectId(id)},
    {$set: projet},
    {returnDocument: 'after'}
  )

  if (!value) {
    throw createError(404, 'Le projet est introuvable')
  }

  return value
}

