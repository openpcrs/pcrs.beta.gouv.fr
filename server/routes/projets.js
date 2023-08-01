import express from 'express'
import createError from 'http-errors'
import w from '../util/w.js'

import {ensureCreator, ensureAdmin, ensureProjectEditor} from '../auth/middleware.js'
import {getProjets, expandProjet, filterSensitiveFields, createProjet, getProjet, getProjetsGeojson, renewEditorKey, deleteProjet, updateProjet} from '../projets.js'

const projetsRoutes = new express.Router()

projetsRoutes.param('projetId', w(async (req, res, next) => {
  const {projetId} = req.params
  const projet = await getProjet(projetId, req)

  if (!projet) {
    throw createError(404, 'L’identifiant de projet demandé n’existe pas')
  }

  req.projet = projet
  next()
}))

projetsRoutes.get('/projets/geojson', w(async (req, res) => {
  const projetsGeojson = await getProjetsGeojson()
  res.send(projetsGeojson)
}))

projetsRoutes.get('/projets/:projetId/renew-editor-key', w(ensureAdmin), w(async (req, res) => {
  const updatedProjet = await renewEditorKey(req.projet)

  res.status(200).send(updatedProjet)
}))

projetsRoutes.get('/projets/:projetId', w(async (req, res) => {
  const projet = expandProjet(req.projet)

  if (req.role === 'admin' || (req.role === 'editor' && req.projet._id.equals(req.canEditProjetId))) {
    return res.send(projet)
  }

  res.send(filterSensitiveFields(projet))
}))

projetsRoutes.delete('/projets/:projetId', w(ensureProjectEditor), w(async (req, res) => {
  await deleteProjet(req.projet._id)
  res.status(204)
}))

projetsRoutes.put('/projets/:projetId', w(ensureProjectEditor), w(async (req, res) => {
  const projet = await updateProjet(req.projet._id, req.body)
  const expandedProjet = expandProjet(projet)

  res.send(expandedProjet)
}))

projetsRoutes.get('/projets', w(async (req, res) => {
  const projets = await getProjets()

  res.send(projets.map(
    projet => expandProjet(filterSensitiveFields(projet))
  ))
}))

projetsRoutes.post('/projets', w(ensureCreator), w(async (req, res) => {
  const projet = await createProjet(req.body, {creator: req.creator})
  const expandedProjet = expandProjet(projet)

  res.status(201).send(expandedProjet)
}))

export default projetsRoutes
