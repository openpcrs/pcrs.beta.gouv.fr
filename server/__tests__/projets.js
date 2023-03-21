/* eslint-disable unicorn/numeric-separators-style */
/* eslint-disable camelcase */
import test from 'ava'
import {MongoMemoryServer} from 'mongodb-memory-server'
import mongo from '../util/mongo.js'
import {getProjets, createProjet, deleteProjet, updateProjet} from '../projets.js'

let mongod

const requiredKeys = ['_id', 'nom', 'regime', 'livrables', 'acteurs', 'perimetres', 'etapes', 'subventions']

test.before('Start server', async () => {
  mongod = await MongoMemoryServer.create()
  await mongo.connect(mongod.getUri())
})

test.after.always('cleanup', async () => {
  await mongo.disconnect()
  await mongod.stop()
})

test.beforeEach('Clean database', async () => {
  await mongo.db.collection('projets').deleteMany()
})

const validProjet = {
  nom: 'Nom du pcrs',
  regime: 'production',
  nature: 'raster',
  livrables: [
    {
      nom: 'Nom du livrable',
      nature: 'geotiff',
      diffusion: 'telechargement',
      licence: 'ouvert_odbl',
      avancement: 100,
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
}

test.serial('create valid projet', async t => {
  const projet = await createProjet(validProjet)

  const createdProjet = await mongo.db.collection('projets').findOne({nom: 'Nom du pcrs'})

  t.true(requiredKeys.every(k => k in createdProjet))
  t.is(createdProjet.nom, 'Nom du pcrs')
  t.is(createdProjet.regime, 'production')
  t.is(createdProjet.etapes.length, 2)
  t.is(projet.nom, createdProjet.nom)
  t.is(createdProjet.regime, projet.regime)
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
  const projet = await mongo.db.collection('projets').insertOne(validProjet)
  const update = await updateProjet(projet.insertedId, {nom: 'plop'})
  const updatedProjet = await mongo.db.collection('projets').findOne({nom: 'plop'})

  t.is(updatedProjet.nom, 'plop')
  t.is(update.nom, updatedProjet.nom)
})

test.serial('get all projets', async t => {
  await mongo.db.collection('projets').insertOne(validProjet)
  await mongo.db.collection('projets').insertOne({nom: 'Un aurte projet PCRS non valide'})

  const projets = await getProjets()

  t.is(projets.length, 2)
})

test.serial('delete projet', async t => {
  const projet = await mongo.db.collection('projets').insertOne(validProjet)
  const {deletedCount} = await deleteProjet(projet.insertedId)
  const deletedProjet = await mongo.db.collection('projets').findOne({nom: 'plop'})

  t.is(deletedCount, 1)
  t.is(deletedProjet, null)
})

