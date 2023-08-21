import express from 'express'
import createError from 'http-errors'
import w from '../util/w.js'

import {ensureAdmin, parseToken} from '../auth/middleware.js'
import {addAdministrator, deleteAdministrator, getAdministratorById, getAdministrators, isSelfDeleting, updateAdministrator} from '../admin/administrators.js'

const administratorsRoutes = new express.Router()

administratorsRoutes.param('adminId', w(async (req, res, next) => {
  const {adminId} = req.params
  const administrator = await getAdministratorById(adminId, req)

  if (!administrator) {
    throw createError(404, 'Cet administrateur n’existe pas')
  }

  req.administrator = administrator
  next()
}))

administratorsRoutes.route('/:adminId')
  .all(w(ensureAdmin))
  .get(w(async (req, res) => {
    res.send(req.administrator)
  }))
  .delete(w(async (req, res) => {
    const token = await parseToken(req)

    await isSelfDeleting(req.params.adminId, token)
    await deleteAdministrator(req.params.adminId)

    res.sendStatus(204)
  }))
  .put(w(async (req, res) => {
    const administrator = await updateAdministrator(req.params.adminId, req.body)

    res.send(administrator)
  }))

administratorsRoutes.route('/')
  .all(w(ensureAdmin))
  .get(w(async (req, res) => {
    const administrators = await getAdministrators()

    res.send(administrators)
  }))
  .post(w(async (req, res) => {
    const administrator = await addAdministrator(req.body)

    res.send(administrator)
  }))

export default administratorsRoutes
