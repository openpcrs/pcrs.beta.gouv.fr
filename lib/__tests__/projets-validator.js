/* eslint-disable camelcase */
/* eslint-disable unicorn/numeric-separators-style */

import test from 'ava'
import Joi from 'joi'
import {validateCreation, validateChanges, validateJoiDate} from '../projets-validator.js'

const validProjet = {
  nom: 'Projet Valide',
  regime: 'production',
  nature: 'raster',
  livrables: [
    {
      nom: 'Images raster',
      nature: 'geotiff',
      diffusion: 'flux',
      licence: 'ouvert_lo'
    }
  ],
  acteurs: [
    {
      siren: 200047389,
      nom: 'FDEA08',
      telephone: '+33324594528',
      role: 'aplc'
    },
    {siren: 444608442, nom: 'Enedis', role: 'financeur'}
  ],
  perimetres: ['departement:08'],
  etapes: [
    {statut: 'investigation', date_debut: null},
    {statut: 'production', date_debut: '1999-02-11'},
    {statut: 'livre', date_debut: '2010-10-12'}
  ],
  subventions: [{nom: 'Participation feder', nature: 'feder'}]
}

const invalidProjet = {
  nom: 'Projet Pas Valide',
  regime: 'productio',
  nature: 'rastèr',
  livrables: [
    {
      nom: 'Images raster',
      nature: 'geotouff',
      diffusion: 'flox',
      licence: 'ouverte_lo'
    }
  ],
  acteurs: [
    {
      siren: 2000473890,
      nom: 'FDEA08',
      telephone: '+33324594528333',
      role: 'apIc'
    },
    {siren: 444608442, nom: 'Eneonze', role: 'financeuse'}
  ],
  perimetres: ['departement:00'],
  etapes: [
    {statut: 'investigation', date_debut: null},
    {statut: 'production', date_debut: '1999-02-11'},
    {statut: 'livre', date_debut: '2010-13-12'}
  ],
  subventions: [{nom: 'Participation feder', ntr: 'feder'}]
}

test('Create valid projet', t => {
  t.notThrows(() => validateCreation(validProjet))
})

test('Create invalid projet', t => {
  t.throws(() => validateCreation(invalidProjet))
})

test('Update valid projet', t => {
  t.notThrows(() => validateChanges(validProjet))
})

test('Update invalid projet', t => {
  t.throws(() => validateChanges(invalidProjet))
})

test('Joi/validateJoiDate : valid', t => {
  const result = Joi.custom(validateJoiDate).validate('2020-01-01')
  t.falsy(result.error)
  t.is(result.value, '2020-01-01')
})

test('Joi/validateJoiDate : not valid', t => {
  const notValidDates = [
    1,
    true,
    0,
    '2020',
    'foo',
    '2020-40-40',
    '2020-01-01T10:00:00.000Z'
  ]

  for (const notValidDate of notValidDates) {
    const result = Joi.custom(validateJoiDate).validate(notValidDate)
    t.is(result.error.message, 'Date invalide')
  }
})
