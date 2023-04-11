import createError from 'http-errors'
import {maxBy} from 'lodash-es'
import {validateCreation, validateChanges} from '../lib/projets-validator.js'
import {buildGeometryFromTerritoires, getTerritoiresProperties} from '../lib/territoires.js'
import mongo from './util/mongo.js'

export function expandProjet(projet) {
  const territoires = projet?.perimetres?.map(p => getTerritoiresProperties(p)) || null

  return {
    ...projet,
    territoires
  }
}

export async function getProjets() {
  return mongo.db.collection('projets').find().toArray()
}

export async function getProjet(projetId) {
  projetId = mongo.parseObjectId(projetId)

  const projet = await mongo.db.collection('projets').findOne({_id: projetId})

  return projet
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

export async function getProjetsGeojson() {
  const projets = await mongo.db.collection('projets').find().toArray()

  const projetsFeatures = await Promise.all(projets.map(async projet => {
    const now = new Date()
    const filteredEtapes = projet.etapes.filter(etape => new Date(etape.date_debut) <= now)
    const closestPostStep = maxBy(filteredEtapes, etape => new Date(etape.date_debut))

    return {
      type: 'Feature',
      geometry: await buildGeometryFromTerritoires(projet.perimetres),
      properties: {
        _id: projet._id,
        nom: projet.nom,
        statut: closestPostStep.statut,
        dateStatut: closestPostStep.date_debut,
        aplc: projet.acteurs.find(acteur => acteur.role === 'aplc')?.nom || null,
        nature: projet.nature
      }
    }
  }))

  return projetsFeatures
}

