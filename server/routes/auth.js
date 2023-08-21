import express from 'express'
import createError from 'http-errors'
import w from '../util/w.js'

import {checkPinCodeValidity, sendPinCodeEmail} from '../auth/pin-code/index.js'
import {getCreatorByEmail} from '../admin/creators-emails.js'

const authRoutes = new express.Router()

authRoutes.post('/ask-code', w(async (req, res) => {
  const authorizedEditorEmail = await getCreatorByEmail(req.body.email)

  if (!authorizedEditorEmail) {
    throw createError(401, 'Cette adresse n’est pas autorisée à créer un projet')
  }

  await sendPinCodeEmail(req.body.email)

  res.status(201).send('ok')
}))

authRoutes.post('/check-code', w(async (req, res) => {
  const {email, pinCode} = req.body
  const validToken = await checkPinCodeValidity({email, pinCode})

  res.send({token: validToken})
}))

authRoutes.get('/me', w(async (req, res) => {
  if (!req.role) {
    throw createError(401, 'Jeton requis')
  }

  res.send({role: req.role})
}))

export default authRoutes
