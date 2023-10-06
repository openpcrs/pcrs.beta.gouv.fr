import express from 'express'
import w from '../util/w.js'

import {ensureAdmin} from '../auth/middleware.js'
import {getUpdatedProjets} from '../admin/reports.js'

const reportRoutes = new express.Router()

reportRoutes.get('/', w(ensureAdmin), w(async (req, res) => {
  const since = new Date(req.query.since)
  const validDate = Number.isNaN(since.valueOf()) ? new Date('2010-01-01') : since
  const report = await getUpdatedProjets(validDate)

  res.send(report)
}))

export default reportRoutes
