import process from 'node:process'
import {customAlphabet} from 'nanoid'
import createError from 'http-errors'
import sharp from 'sharp'
import {deleteObjects, uploadObject} from '../../util/s3.js'

const {S3_PREFIX} = process.env

function resizeImageToThumbnail(imageBuffer) {
  return sharp(imageBuffer).resize({height: 250, width: 500}).toBuffer()
}

export async function uploadImage(file) {
  const imageBuffer = sharp(file.buffer)
  const metadata = await imageBuffer.metadata()
  const nanoid = customAlphabet('1234567890abcdef', 10)
  const token = nanoid()
  const fileName = encodeURIComponent(`${token}_${file.originalname.replaceAll(' ', '_')}`)

  if (!file) {
    throw createError(400, 'Aucun fichier envoyé')
  }

  if (metadata.width < 500 || metadata.height < 250) {
    throw createError(400, 'L’image doit faire au moins 500x250 pixels')
  }

  const resizedImageBuffer = await resizeImageToThumbnail(file.buffer)

  await uploadObject({
    objectKey: `${S3_PREFIX}/originals/${fileName}`,
    buffer: file.buffer,
    options: {
      ContentType: file.mimetype
    }
  })

  const {Location} = await uploadObject({
    objectKey: `${S3_PREFIX}/resized/${fileName}`,
    buffer: resizedImageBuffer,
    options: {
      ContentType: file.mimetype,
      ACL: 'public-read'
    }
  })

  return {
    imageURL: Location,
    imageKey: fileName
  }
}

export async function deleteImage(imageKey) {
  await deleteObjects([
    {Key: S3_PREFIX + '/resized/' + imageKey},
    {Key: S3_PREFIX + '/originals/' + imageKey}
  ])
}
