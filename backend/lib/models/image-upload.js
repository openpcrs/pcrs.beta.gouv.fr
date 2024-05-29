import process from 'node:process'
import {customAlphabet} from 'nanoid'
import createError from 'http-errors'
import sharp from 'sharp'
import {DeleteObjectsCommand, S3} from '@aws-sdk/client-s3'
import {Upload} from '@aws-sdk/lib-storage'

const {S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET, S3_REGION, S3_ENDPOINT, S3_PREFIX} = process.env

const client = new S3({
  region: S3_REGION,
  endpoint: S3_ENDPOINT,
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY
  }
})

function computeImageSize(imageBuffer) {
  return sharp(imageBuffer).resize({height: 250, width: 500}).toBuffer()
}

export function checkAuthorization(req) {
  if (!['admin', 'editor', 'creator'].includes(req.role)) {
    throw createError(403, 'Non autorisé')
  }
}

export async function uploadImage(file) {
  const imageBuffer = sharp(file.buffer)
  const metadata = await imageBuffer.metadata()
  const nanoid = customAlphabet('1234567890abcdef', 10)
  const token = nanoid()
  const fileName = `${token}_${file.originalname.replaceAll(' ', '_')}`

  if (!file) {
    throw createError(400, 'Aucun fichier envoyé')
  }

  if (!['webp', 'png', 'jpg', 'jpeg'].includes(metadata.format)) {
    throw createError(400, 'Format d’image non supporté')
  }

  if (metadata.size > 3_000_000) {
    throw createError(400, 'L’image doit faire moins de 3 Mo')
  }

  if (metadata.width < 500 || metadata.height < 250) {
    throw createError(400, 'L’image doit faire au moins 500x250 pixels')
  }

  const resizedImageBuffer = await computeImageSize(file.buffer)

  const originalImage = new Upload({
    client,
    params: {
      Bucket: S3_BUCKET,
      Key: `${S3_PREFIX}/originals/${fileName}`,
      Body: imageBuffer,
      ContentType: file.mimetype,
      ACL: 'public-read'
    }
  })

  const resizedImage = new Upload({
    client,
    params: {
      Bucket: S3_BUCKET,
      Key: `${S3_PREFIX}/resized/${fileName}`,
      Body: resizedImageBuffer,
      ContentType: file.mimetype,
      ACL: 'public-read'
    }
  })

  await originalImage.done() // Upload image with original size
  const {Location} = await resizedImage.done()

  return {
    imageURL: Location,
    imageKey: fileName
  }
}

export async function deleteImage(imageKey) {
  const deletedImages = new DeleteObjectsCommand({
    Bucket: S3_BUCKET,
    Delete: {
      Objects: [
        {Key: S3_PREFIX + '/resized/' + imageKey},
        {Key: S3_PREFIX + '/originals/' + imageKey}
      ]
    }
  })

  await client.send(deletedImages)
}
