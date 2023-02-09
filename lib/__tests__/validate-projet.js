import {readFile} from 'node:fs/promises'
import test from 'ava'
import yaml from 'js-yaml'
import validate from '../validate-projet.js'

async function readFixtureYaml(fileName) {
  const filePath = new URL('./fixtures/' + fileName, import.meta.url)
  const fileData = await readFile(filePath, {encoding: 'utf8'})
  return yaml.load(fileData)
}

test('validate / errors', async t => {
  const projet = await readFixtureYaml('projet-with-errors.yaml')
  const {error} = validate(projet)
  const errors = error.details.map(err => err.message)

  t.truthy(error)
  t.is(errors.length, 5)
  t.is(errors[0], '"nature" must be one of [vecteur, raster, mixte]')
  t.is(errors[1], '"livrables" is required')
  t.is(errors[2], '"acteurs" is required')
  t.is(errors[3], '"etapes[2].statut" must be one of [investigation, production, produit, livre, obsolete]')
  t.is(errors[4], '"livrable" is not allowed')
})
