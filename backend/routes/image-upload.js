import express from 'express'
import multer from 'multer'
import createError from 'http-errors'
import w from '../util/w.js'
import {uploadImage, deleteImage} from '../lib/models/image-upload.js'

const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: 3_000_000
  }
})
const imageUploadRoutes = new express.Router()

export function checkAuthorization(req) {
  if (!['admin', 'editor', 'creator'].includes(req.role)) {
    throw createError(403, 'Non autorisé')
  }

  if (req.role === 'editor' && req.canEditProjetId.toString() !== req.query.projectId) {
    throw createError(403, 'Non autorisé')
  }
}

imageUploadRoutes.delete('/:imageKey', w(async (req, res) => {
  checkAuthorization(req)

  const {imageKey} = req.params

  await deleteImage(imageKey)

  res.sendStatus(204)
}))

imageUploadRoutes.post('/', upload.single('image'), w(async (req, res) => {
  checkAuthorization(req)

  const {file} = req
  const response = await uploadImage(file)

  res.send(response)
}))

export default imageUploadRoutes
