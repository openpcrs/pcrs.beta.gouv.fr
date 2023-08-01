import express from 'express'
import createError from 'http-errors'
import w from '../util/w.js'

import {sendPinCodeEmail} from '../auth/index.js'
import {checkPinCodeValidity} from '../auth/pin-code.js'
import {getCreatorByEmail} from '../admin/creators-emails.js'

const exportAuthRouter = new express.Router()

exportAuthRouter.post('/ask-code', w(async (req, res) => {
  const authorizedEditorEmail = await getCreatorByEmail(req.body.email)

  if (!authorizedEditorEmail) {
    throw createError(401, 'Cette adresse n’est pas autorisée à créer un projet')
  }

  await sendPinCodeEmail(req.body.email)

  res.status(201).send('ok')
}))

exportAuthRouter.post('/check-code', w(async (req, res) => {
  const {email, pinCode} = req.body
  const validToken = await checkPinCodeValidity({email, pinCode})

  res.send({token: validToken})
}))

exportAuthRouter.get('/me', w(async (req, res) => {
  if (!req.role) {
    throw createError(401, 'Jeton requis')
  }

  res.send({role: req.role})
}))

export default exportAuthRouter
