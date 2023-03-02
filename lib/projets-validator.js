/* eslint-disable camelcase */

import Joi from 'joi'
import {parse, isValid} from 'date-fns'
import {validatePayload} from '../server/util/payload.js'
import {createGeometryBuilder} from '../lib/build-geometry.js'

const geometryBuilder = await createGeometryBuilder()

function validatePerimetre(perimetre) {
  const fields = perimetre.split(':')

  if (!['epci', 'departement', 'commune'].includes(fields[0])) {
    throw new Error('Le type de territoire est invalide')
  }

  // Check if territory exist
  geometryBuilder.getTerritoire(perimetre)

  return perimetre
}

function validateJoiDate(date, helpers) {
  const parsedDate = parse(date, 'yyyy-MM-dd', new Date())

  if (!isValid(parsedDate)) {
    return helpers.message('Date invalide')
  }

  return true
}

const acteursSchemaCreation = Joi.object().keys({
  siren: Joi.number().required(),
  nom: Joi.string(),
  interlocuteur: Joi.string(),
  mail: Joi.string().email(),
  telephone: Joi.string().pattern(/^((\+)33|0|0033)[1-9](\d{2}){4}$/),
  role: Joi.valid(
    'aplc',
    'financeur',
    'diffuseur',
    'presta_vol',
    'presta_lidar',
    'controleur'
  ).required(),
  finance_part_perc: Joi.number(),
  finance_part_euro: Joi.number()
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
  crs: Joi.string(),
  avancement: Joi.string(),
  compression: Joi.string()
})

const subventionsSchemaCreation = Joi.object().keys({
  nom: Joi.string().required(),
  nature: Joi.valid(
    'feder',
    'cepr',
    'detr'
  ).required(),
  montant: Joi.number(),
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
  nom: Joi.string(),
  interlocuteur: Joi.string(),
  mail: Joi.string().email(),
  telephone: Joi.string().pattern(/^((\+)33|0|0033)[1-9](\d{2}){4}$/),
  role: Joi.valid(
    'aplc',
    'financeur',
    'diffuseur',
    'presta_vol',
    'presta_lidar',
    'controleur'
  ),
  finance_part_perc: Joi.number(),
  finance_part_euro: Joi.number()
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
  ),
  crs: Joi.string(),
  avancement: Joi.string(),
  compression: Joi.string()
})

const subventionsSchemaUpdate = Joi.object().keys({
  nom: Joi.string(),
  nature: Joi.valid(
    'feder',
    'cepr',
    'detr'
  ),
  montant: Joi.number(),
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
  validatePayload(projet, schemaCreation)
}

function validateChanges(changes) {
  validatePayload(changes, schemaUpdate)
}

export {validateCreation, validateChanges}

