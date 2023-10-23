import process from 'node:process'
import got from 'got'

const {SCANNER_URL, SCANNER_ADMIN_TOKEN} = process.env

if (!SCANNER_ADMIN_TOKEN) {
  throw new Error('SCANNER_ADMIN_TOKEN must be defined')
}

export async function attachStorage({type, params}) {
  const {_id} = await got.post(`${SCANNER_URL}/storages`, {
    json: {type, params},
    headers: {authorization: `Token ${SCANNER_ADMIN_TOKEN}`}
  }).json()

  return {_id}
}

export async function askDownloadToken({stockageId}) {
  const {token} = await got.post(`${SCANNER_URL}/storages/${stockageId}/generate-download-token`, {
    headers: {authorization: `Token ${SCANNER_ADMIN_TOKEN}`}
  }).json()

  return {token}
}

