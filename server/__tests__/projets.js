/* eslint-disable unicorn/numeric-separators-style */
/* eslint-disable camelcase */
import test from 'ava'
import {MongoMemoryServer} from 'mongodb-memory-server'
import mongo from '../util/mongo.js'
import {getProjets, createProjet, deleteProjet, updateProjet} from '../projets.js'

let mongod

const requiredKEys = ['_id', 'nom', 'regime', 'livrables', 'acteurs', 'perimetres', 'etapes', 'subventions']

test.before('Start server', async () => {
  mongod = await MongoMemoryServer.create()
  await mongo.connect(mongod.getUri())
})

test.after.always('cleanup', async () => {
  await mongo.disconnect()
  await mongod.stop()
})

test.serial('create valid projet', async t => {
  const projet = await createProjet({
    nom: 'Nom du pcrs',
    regime: 'production',
    nature: 'raster',
    livrables: [
      {
        nom: 'Nom du livrable',
        nature: 'geotiff',
        diffusion: 'telechargement',
        licence: 'ouvert_odbl',
        avancement: '100',
        crs: 'EPSG:2971',
        compression: 'Nature untelle'
      }
    ],
    acteurs: [
      {
        nom: 'living data',
        siren: 813600889,
        role: 'aplc',
        telephone: '0600000000',
        finance_part_perc: 50,
        finance_part_euro: 120000
      }
    ],
    perimetres: [
      'epci:200039865'
    ],
    etapes: [
      {
        statut: 'investigation',
        date_debut: '2023-02-06'
      },
      {
        statut: 'production',
        date_debut: null
      }
    ],
    subventions: [
      {
        nom: 'Une subvention voilà quoi',
        nature: 'feder',
        montant: 100000,
        echeance: '2024-04-10'
      }
    ]
  })

  t.true(requiredKEys.every(k => k in projet))
  t.is(projet.nom, 'Nom du pcrs')
  t.is(projet.regime, 'production')
  t.is(projet.etapes.length, 2)
})

test.serial('create invalid projet', async t => {
  const projet = {
    nom: 'pcrs invalide',
    regime: 'production',
    livrables: 'coucou'
  }

  await t.throwsAsync(() => createProjet(projet))
})

test.serial('update projet', async t => {
  const projet = await createProjet({
    nom: 'Nom du pcrs à mettre à jour',
    regime: 'production',
    nature: 'raster',
    livrables: [
      {
        nom: 'Nom du livrable',
        nature: 'geotiff',
        diffusion: 'telechargement',
        licence: 'ouvert_odbl',
        avancement: '100',
        crs: 'EPSG:2971',
        compression: 'Nature untelle'
      }
    ],
    acteurs: [
      {
        nom: 'living data',
        siren: 813600889,
        role: 'aplc',
        telephone: '0600000000',
        finance_part_perc: 50,
        finance_part_euro: 120000
      }
    ],
    perimetres: [
      'epci:200039865'
    ],
    etapes: [
      {
        statut: 'investigation',
        date_debut: '2023-02-06'
      },
      {
        statut: 'production',
        date_debut: null
      }
    ],
    subventions: [
      {
        nom: 'Une subvention voilà quoi',
        nature: 'feder',
        montant: 100000,
        echeance: '2024-04-10'
      }
    ]
  })

  const updatedProjet = await updateProjet(projet._id, {nom: 'plop'})

  t.is(updatedProjet.nom, 'plop')
})

test.serial('get all projets', async t => {
  const projets = await getProjets()

  t.is(projets.length, 2)
})

test.serial('delete projet', async t => {
  const projet = await mongo.db.collection('projets').findOne({nom: 'plop'})
  const {deletedCount} = await deleteProjet(projet._id)

  t.is(deletedCount, 1)
})

