import express from 'express'
import {ensureAdmin} from '../auth/middleware.js'
import w from '../util/w.js'

import {exportProjetsAsCSV, exportLivrablesAsCSV, exportToursDeTableAsCSV, exportSubventionsAsCSV, exportEditorKeys} from '../export/csv.js'

const dataRoutes = new express.Router()

dataRoutes.get('/projets.csv', w(async (req, res) => {
  const projetsCSVFile = await exportProjetsAsCSV(req.query.includesWkt === '1')

  res.attachment('projets.csv').type('csv').send(projetsCSVFile)
}))

dataRoutes.get('/livrables.csv', w(async (req, res) => {
  const livrablesCSVFile = await exportLivrablesAsCSV()

  res.attachment('livrables.csv').type('csv').send(livrablesCSVFile)
}))

dataRoutes.get('/tours-de-table.csv', w(async (req, res) => {
  const toursDeTableCSVFile = await exportToursDeTableAsCSV()

  res.attachment('tours-de-table.csv').type('csv').send(toursDeTableCSVFile)
}))

dataRoutes.get('/subventions.csv', w(async (req, res) => {
  const subventionsCSVFile = await exportSubventionsAsCSV()

  res.attachment('subventions.csv').type('csv').send(subventionsCSVFile)
}))

dataRoutes.get('/editor-keys.csv', w(ensureAdmin), w(async (req, res) => {
  const editorKeysCSVFile = await exportEditorKeys()

  res.attachment('editor-keys.csv').type('csv').send(editorKeysCSVFile)
}))

export default dataRoutes
