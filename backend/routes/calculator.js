import express from 'express'
import w from '../util/w.js'

import {getAreaFromTerritory} from '../lib/territoires.js'
import {areaSizeToGigas} from '../lib/calculator.js'

const calculatorRoutes = new express.Router()

calculatorRoutes.get('/territory-area/:code', w(async (req, res) => {
  const area = await getAreaFromTerritory(req.params.code)

  res.send({surface: area})
}))

calculatorRoutes.post('/area', w(async (req, res) => {
  const {area, compression, resolution, margin} = req.body
  const areaSizeInGigas = areaSizeToGigas(area, compression, resolution, margin)

  res.send(areaSizeInGigas)
}))

export default calculatorRoutes
