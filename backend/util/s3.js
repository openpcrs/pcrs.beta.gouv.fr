import process from 'node:process'
import {S3, ListObjectsV2Command, DeleteObjectsCommand} from '@aws-sdk/client-s3'
import {Upload} from '@aws-sdk/lib-storage'

const {S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET, S3_REGION, S3_ENDPOINT, S3_PREFIX} = process.env

if (!S3_ACCESS_KEY || !S3_SECRET_KEY || !S3_BUCKET || !S3_REGION || !S3_ENDPOINT) {
  throw new Error('S3 configuration is not complete')
}

const client = new S3({
  region: S3_REGION,
  endpoint: S3_ENDPOINT,
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY
  }
})

export async function uploadObject({objectKey, buffer, options = {}}) {
  const upload = new Upload({
    client,
    params: {
      Bucket: S3_BUCKET,
      Key: objectKey,
      Body: buffer,
      ...options
    }
  })

  return upload.done()
}

export async function deleteObjects(objects) {
  const deletedImages = new DeleteObjectsCommand({
    Bucket: S3_BUCKET,
    Delete: {
      Objects: objects
    }
  })

  return client.send(deletedImages)
}

export async function listObjects() {
  const listObjects = new ListObjectsV2Command({
    Bucket: S3_BUCKET,
    Prefix: S3_PREFIX
  })

  return client.send(listObjects)
}
