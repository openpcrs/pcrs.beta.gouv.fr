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
  t.truthy(error)
})
