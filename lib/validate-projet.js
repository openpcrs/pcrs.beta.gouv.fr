/* eslint-disable camelcase */

import Joi from 'joi'

const acteursSchema = Joi.object().keys({
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

const etapesSchema = Joi.object().keys({
  statut: Joi.valid(
    'investigation',
    'production',
    'produit',
    'livre',
    'obsolete'
  ).required(),
  date_debut: Joi.date().allow(null).required()
})

const livrablesSchema = Joi.object().keys({
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

const subventionsSchema = Joi.object().keys({
  nom: Joi.string().required(),
  nature: Joi.valid(
    'feder',
    'cepr',
    'detr'
  ).required(),
  montant: Joi.number(),
  echeance: Joi.date()
})

const schema = Joi.object({
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
  livrables: Joi.array().items(livrablesSchema).required(),
  acteurs: Joi.array().items(acteursSchema).required(),
  perimetres: Joi.array().items(Joi.string()).required(),
  etapes: Joi.array().items(etapesSchema).required(),
  subventions: Joi.array().items(subventionsSchema).required().allow(null)
}).prefs({convert: false})

function validate(projet) {
  return schema.validate(projet, {abortEarly: false})
}

export default validate
