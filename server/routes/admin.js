import express from 'express'
import createError from 'http-errors'
import w from '../util/w.js'
import {addCreator, deleteCreator, getCreatorById, getCreators, updateCreator} from '../admin/creators-emails.js'
import {ensureAdmin} from '../auth/middleware.js'
import {getUpdatedProjets} from '../admin/reports.js'

const adminRoutes = new express.Router()

adminRoutes.get('/creator-email/:emailId', w(ensureAdmin), w(async (req, res) => {
  const email = await getCreatorById(req.params.emailId)

  if (!email) {
    throw createError(404, 'Email introuvable')
  }

  res.send(email)
}))

adminRoutes.delete('/creator-email/:emailId', w(ensureAdmin), w(async (req, res) => {
  await deleteCreator(req.params.emailId)

  res.sendStatus(204)
}))

adminRoutes.put('/creator-email/:emailId', w(ensureAdmin), w(async (req, res) => {
  const email = await updateCreator(req.params.emailId, req.body)

  res.send(email)
}))

adminRoutes.get('/creator-emails', w(ensureAdmin), w(async (req, res) => {
  const emails = await getCreators()

  res.send(emails)
}))

adminRoutes.post('/creator-emails', w(ensureAdmin), w(async (req, res) => {
  const email = await addCreator(req.body)

  res.send(email)
}))

adminRoutes.get('/report', w(ensureAdmin), w(async (req, res) => {
  const since = new Date(req.query.since)
  const validDate = Number.isNaN(since.valueOf()) ? new Date('2010-01-01') : since

  const report = await getUpdatedProjets(validDate)
  res.send(report)
}))

export default adminRoutes
