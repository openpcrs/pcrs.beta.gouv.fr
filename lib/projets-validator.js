/* eslint-disable camelcase */

import Joi from 'joi'
import {validatePayload} from '../server/util/payload.js'
import {ensureTerritoireExists} from '../lib/territoires.js'

function validatePerimetre(perimetre) {
  const fields = perimetre.split(':')

  if (!['epci', 'departement', 'commune'].includes(fields[0])) {
    throw new Error('Le type de territoire est invalide')
  }

  // Check if territory exist
  ensureTerritoireExists(perimetre)

  return perimetre
}

export function validateJoiDate(date, helpers) {
  if (!date || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return helpers.message('Date invalide')
  }

  const parsedDate = new Date(date)

  if (parsedDate.toString() === 'Invalid Date') {
    return helpers.message('Date invalide')
  }

  return date
}

const acteursSchemaCreation = Joi.object().keys({
  siren: Joi.number().required(),
  nom: Joi.string().allow(null),
  interlocuteur: Joi.string().allow(null),
  mail: Joi.string().email().allow(null),
  telephone: Joi.string().pattern(/^((\+)33|0|0033)[1-9](\d{2}){4}$/).allow(null),
  role: Joi.valid(
    'aplc',
    'financeur',
    'diffuseur',
    'presta_vol',
    'presta_lidar',
    'controleur'
  ).required(),
  finance_part_perc: Joi.number().allow(null),
  finance_part_euro: Joi.number().allow(null)
})

const etapesSchemaCreation = Joi.object().keys({
  statut: Joi.valid(
    'investigation',
    'production',
    'produit',
    'livre',
    'obsolete'
  ).required(),
  date_debut: Joi.custom(validateJoiDate).allow(null).required()
})

const livrablesSchemaCreation = Joi.object().keys({
  nom: Joi.string().required(),
  nature: Joi.valid(
    'geotiff',
    'jpeg2000',
    'gml'
  ).required(),
  licence: Joi.valid(
    'ouvert_lo',
    'ouvert_odbl',
    'ferme'
  ).required(),
  diffusion: Joi.valid(
    'telechargement',
    'flux'
  ),
  crs: Joi.string().allow(null),
  avancement: Joi.number().allow(null),
  compression: Joi.string().allow(null)
})

const subventionsSchemaCreation = Joi.object().keys({
  nom: Joi.string().required(),
  nature: Joi.valid(
    'feder',
    'cepr',
    'detr'
  ).required(),
  montant: Joi.number().allow(null),
  echeance: Joi.custom(validateJoiDate).allow(null)
})

const schemaCreation = Joi.object({
  nom: Joi.string()
    .min(3)
    .required(),
  regime: Joi.valid(
    'production',
    'maj'
  ).required(),
  nature: Joi.valid(
    'vecteur',
    'raster',
    'mixte'
  ).required(),
  livrables: Joi.array().items(livrablesSchemaCreation).required(),
  acteurs: Joi.array().items(acteursSchemaCreation).required(),
  perimetres: Joi.array().items(Joi.string().custom(validatePerimetre)).min(1).required(),
  etapes: Joi.array().items(etapesSchemaCreation).required(),
  subventions: Joi.array().items(subventionsSchemaCreation).required().allow(null)
})

const acteursSchemaUpdate = Joi.object().keys({
  siren: Joi.number(),
  nom: Joi.string().allow(null),
  interlocuteur: Joi.string().allow(null),
  mail: Joi.string().email().allow(null),
  telephone: Joi.string().pattern(/^((\+)33|0|0033)[1-9](\d{2}){4}$/).allow(null),
  role: Joi.valid(
    'aplc',
    'financeur',
    'diffuseur',
    'presta_vol',
    'presta_lidar',
    'controleur'
  ),
  finance_part_perc: Joi.number().allow(null),
  finance_part_euro: Joi.number().allow(null)
})

const etapesSchemaUpdate = Joi.object().keys({
  statut: Joi.valid(
    'investigation',
    'production',
    'produit',
    'livre',
    'obsolete'
  ),
  date_debut: Joi.custom(validateJoiDate).allow(null).required()
})

const livrablesSchemaUpdate = Joi.object().keys({
  nom: Joi.string(),
  nature: Joi.valid(
    'geotiff',
    'jpeg2000',
    'gml'
  ),
  licence: Joi.valid(
    'ouvert_lo',
    'ouvert_odbl',
    'ferme'
  ),
  diffusion: Joi.valid(
    'telechargement',
    'flux'
  ).allow(null),
  crs: Joi.string().allow(null),
  avancement: Joi.number().allow(null),
  compression: Joi.string().allow(null)
})

const subventionsSchemaUpdate = Joi.object().keys({
  nom: Joi.string(),
  nature: Joi.valid(
    'feder',
    'cepr',
    'detr'
  ),
  montant: Joi.number().allow(null),
  echeance: Joi.custom(validateJoiDate).allow(null)
})

const schemaUpdate = Joi.object({
  nom: Joi.string()
    .min(3),
  regime: Joi.valid(
    'production',
    'maj'
  ),
  nature: Joi.valid(
    'vecteur',
    'raster',
    'mixte'
  ),
  livrables: Joi.array().items(livrablesSchemaUpdate),
  acteurs: Joi.array().items(acteursSchemaUpdate),
  perimetres: Joi.array().items(Joi.string()),
  etapes: Joi.array().items(etapesSchemaUpdate),
  subventions: Joi.array().items(subventionsSchemaUpdate).allow(null)
})

function validateCreation(projet) {
  return validatePayload(projet, schemaCreation)
}

function validateChanges(changes) {
  return validatePayload(changes, schemaUpdate)
}

export {validateCreation, validateChanges, validatePerimetre}

