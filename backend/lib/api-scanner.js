import process from 'node:process'
import got from 'got'

const {SCANNER_URL} = process.env

export async function attachStorage({type, params}) {
  const {_id} = await got.post(`${SCANNER_URL}/storages`, {
    json: {type, params}
  }).json()

  return {_id}
}
