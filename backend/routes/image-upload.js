import express from 'express'
import multer from 'multer'
import w from '../util/w.js'
import {uploadImage, deleteImage, checkAuthorization} from '../lib/models/image-upload.js'

const storage = multer.memoryStorage()
const upload = multer({storage})
const imageUploadRoutes = new express.Router()

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
