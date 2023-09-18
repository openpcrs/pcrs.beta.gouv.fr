import express from 'express'
import w from '../util/w.js'

import {getAreaFromTerritory} from '../../lib/territoires.js'
import {areaWeigthInGigas} from '../calculator.js'

const calculatorRoutes = new express.Router()

calculatorRoutes.get('/territory-area/:code', w(async (req, res) => {
  const area = await getAreaFromTerritory(req.params.code)

  res.send({surface: area})
}))

calculatorRoutes.post('/area', w(async (req, res) => {
  const {area, compression, resolution, marge} = req.body
  const areaSizeInGigas = areaWeigthInGigas(area, compression, resolution, marge)

  res.send(areaSizeInGigas)
}))

export default calculatorRoutes
