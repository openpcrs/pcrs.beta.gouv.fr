import process from 'node:process'
import got from 'got'

const {SCANNER_URL} = process.env

export async function updateLivrableStockage(livrables) {
  if (!SCANNER_URL) {
    return [...livrables]
  }

  const updatedLivrables = await Promise.all(livrables.map(async livrable => {
    const type = livrable.stockage
    const params = livrable.stockage_params

    if (!type) {
      return livrable
    }

    const response = await got.post(`${SCANNER_URL}/storages`, {
      json: {type, params}
    }).json()

    const {_id} = response

    return {
      ...livrable,
      // eslint-disable-next-line camelcase
      stockage_id: _id
    }
  }))

  return updatedLivrables
}

