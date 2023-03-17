/* eslint-disable camelcase */
/* eslint-disable unicorn/numeric-separators-style */

import test from 'ava'
import Joi from 'joi'
import {validateCreation, validateChanges, validateJoiDate, validatePerimetre} from '../projets-validator.js'

const validProjet = {
  nom: 'Projet Valide',
  regime: 'production',
  nature: 'raster',
  livrables: [
    {
      nom: 'Images raster',
      nature: 'geotiff',
      diffusion: 'flux',
      licence: 'ouvert_lo',
      avancement: 18,
      crs: 'ok',
      compression: null
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
  regime: 'productio',
  nature: 'rastèr',
  livrables: [
    {
      nom: 'Images raster',
      nature: 'geotouff',
      diffusion: 'flox',
      licence: 'ouverte_lo',
      avancement: '12'
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

// Test validatePerimetre

test('Valid perimetre, departement', t => {
  t.is(validatePerimetre('departement:55'), 'departement:55')
})

test('Invalid perimetre, departement', t => {
  const error = t.throws(() => {
    validatePerimetre('departement:666')
  }, {instanceOf: Error})

  t.is(error.message, 'Territory not found: departement:666')
})

test('Valid perimetre, epci', t => {
  t.is(validatePerimetre('epci:200038990'), 'epci:200038990')
})

test('Invalid perimetre, epci', t => {
  const error = t.throws(() => {
    validatePerimetre('epci:666')
  }, {instanceOf: Error})

  t.is(error.message, 'Territory not found: epci:666')
})

test('Valid perimetre, commune', t => {
  t.is(validatePerimetre('commune:55500'), 'commune:55500')
})

test('Invalid perimetre, commune', t => {
  const error = t.throws(() => {
    validatePerimetre('commune:666')
  }, {instanceOf: Error})

  t.is(error.message, 'Territory not found: commune:666')
})

// Test validateCreation

test('Create valid projet', t => {
  t.notThrows(() => validateCreation(validProjet))
})

test('Create invalid projet', t => {
  const error = t.throws(() => {
    validateCreation(invalidProjet)
  }, {instanceOf: Error})

  t.is(error.details.length, 14)
  t.is(error.details[0].message, '"nom" is required')
  t.is(error.details[1].message, '"regime" must be one of [production, maj]')
  t.is(error.details[2].message, '"nature" must be one of [vecteur, raster, mixte]')
  t.is(error.details[3].message, '"livrables[0].nature" must be one of [geotiff, jpeg2000, gml]')
  t.is(error.details[4].message, '"livrables[0].licence" must be one of [ouvert_lo, ouvert_odbl, ferme]')
  t.is(error.details[5].message, '"livrables[0].diffusion" must be one of [telechargement, flux]')
  t.is(error.details[6].message, '"livrables[0].avancement" must be a number')
  t.is(error.details[7].message, '"acteurs[0].telephone" with value "+33324594528333" fails to match the required pattern: /^((\\+)33|0|0033)[1-9](\\d{2}){4}$/')
  t.is(error.details[8].message, '"acteurs[0].role" must be one of [aplc, financeur, diffuseur, presta_vol, presta_lidar, controleur]')
  t.is(error.details[9].message, '"acteurs[1].role" must be one of [aplc, financeur, diffuseur, presta_vol, presta_lidar, controleur]')
  t.is(error.details[10].message, '"perimetres[0]" failed custom validation because Territory not found: departement:00')
  t.is(error.details[11].message, 'Date invalide')
  t.is(error.details[12].message, '"subventions[0].nature" is required')
  t.is(error.details[13].message, '"subventions[0].ntr" is not allowed')
})

// Test validateChanges

test('Update valid projet', t => {
  t.notThrows(() => validateChanges(validProjet))
})

test('Update invalid projet', t => {
  const error = t.throws(() => {
    validateChanges(invalidProjet)
  }, {instanceOf: Error})

  t.is(error.details.length, 11)
  t.is(error.details[0].message, '"regime" must be one of [production, maj]')
  t.is(error.details[1].message, '"nature" must be one of [vecteur, raster, mixte]')
  t.is(error.details[2].message, '"livrables[0].nature" must be one of [geotiff, jpeg2000, gml]')
  t.is(error.details[3].message, '"livrables[0].licence" must be one of [ouvert_lo, ouvert_odbl, ferme]')
  t.is(error.details[4].message, '"livrables[0].diffusion" must be one of [telechargement, flux, null]')
  t.is(error.details[5].message, '"livrables[0].avancement" must be a number')
  t.is(error.details[6].message, '"acteurs[0].telephone" with value "+33324594528333" fails to match the required pattern: /^((\\+)33|0|0033)[1-9](\\d{2}){4}$/')
  t.is(error.details[7].message, '"acteurs[0].role" must be one of [aplc, financeur, diffuseur, presta_vol, presta_lidar, controleur]')
  t.is(error.details[8].message, '"acteurs[1].role" must be one of [aplc, financeur, diffuseur, presta_vol, presta_lidar, controleur]')
  t.is(error.details[9].message, 'Date invalide')
  t.is(error.details[10].message, '"subventions[0].ntr" is not allowed')
})

// Test validateJoiDate

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
    '2020-01-01T10:00:00.000Z',
    '10-10-10'
  ]

  for (const notValidDate of notValidDates) {
    const result = Joi.custom(validateJoiDate).validate(notValidDate)
    t.is(result.error.message, 'Date invalide')
  }
})
