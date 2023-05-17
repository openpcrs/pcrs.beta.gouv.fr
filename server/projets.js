import createError from 'http-errors'
import {omit} from 'lodash-es'
import {nanoid} from 'nanoid'
import {validateCreation, validateChanges} from '../lib/projets-validator.js'
import {buildGeometryFromTerritoires, getTerritoiresProperties} from '../lib/territoires.js'
import {findClosestEtape} from '../lib/suivi-pcrs.js'
import mongo from './util/mongo.js'

export function expandProjet(projet) {
  const territoires = projet?.perimetres?.map(p => getTerritoiresProperties(p)) || null

  return {
    ...projet,
    territoires
  }
}

export async function generateEditorKey(projetId) {
  projetId = mongo.parseObjectId(projetId)

  await mongo.db.collection('projets').updateOne(
    {_id: projetId, editorKey: {$exists: false}},
    {$set: {editorKey: nanoid()}}
  )
}

export function checkIsEditor(projet, req) {
  const test = req.get('Authorization') === `Token ${projet.editorKey}` || req.get('Authorization') === `Token ${process.env.ADMIN_TOKEN}`

  return test
}

export function filterSensitiveFields(projet) {
  return omit(projet, 'editorKey')
}

export async function getProjets() {
  const projets = await mongo.db.collection('projets').find().toArray()
  return projets.map(p => filterSensitiveFields(p))
}

export async function getProjet(projetId, req) {
  projetId = mongo.parseObjectId(projetId)

  const projet = await mongo.db.collection('projets').findOne({_id: projetId})

  return checkIsEditor(projet, req) ? projet : filterSensitiveFields(projet)
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

  try {
    const {value} = await mongo.db.collection('projets').findOneAndUpdate(
      {_id: mongo.parseObjectId(id)},
      {$set: projet},
      {returnDocument: 'after'}
    )

    if (!value) {
      throw createError(404, 'Le projet est introuvable')
    }

    return value
  } catch (error) {
    if (error.codeName === 'DuplicateKey') {
      throw createError(410, 'Un projet avec le même nom est déjà existant, merci de modifier le champ "nom"')
    }

    throw error
  }
}

export async function getProjetsGeojson() {
  const projets = await mongo.db.collection('projets').find().toArray()

  const projetsFeatures = await Promise.all(projets.map(async projet => {
    const closestPostStep = findClosestEtape(projet.etapes)

    return {
      type: 'Feature',
      geometry: await buildGeometryFromTerritoires(projet.perimetres),
      properties: {
        _id: projet._id,
        nom: projet.nom,
        statut: closestPostStep?.statut,
        dateStatut: closestPostStep?.date_debut,
        aplc: projet.acteurs.find(acteur => acteur.role === 'aplc' || acteur.role === 'porteur')?.nom || null,
        nature: projet.nature
      }
    }
  }))

  return projetsFeatures
}

