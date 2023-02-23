import createError from 'http-errors'
import {validateCreation, validateUpdate} from '../lib/validate-projet.js'
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

  mongo.addObjectId(projet)

  try {
    await mongo.db.collection('projets').insertOne(projet)
  } catch (error) {
    throw createError(400, 'Impossible d’ajouter le projet: ' + error)
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
  const projet = validateUpdate(payload)

  if (Object.keys(projet).length === 0) {
    throw createError(400, 'Le contenu de la requête est invalide (aucuns champs valide trouvé)')
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
