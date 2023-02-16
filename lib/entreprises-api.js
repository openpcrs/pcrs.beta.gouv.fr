import HttpError from './http-error.js'

const API_SIRENE_URL = 'https://recherche-entreprises.api.gouv.fr'

export async function _fetch(url) {
  const options = {
    mode: 'cors',
    method: 'GET'
  }

  const response = await fetch(url, options)
  const contentType = response.headers.get('content-type')

  if (!response.ok) {
    throw new HttpError(response)
  }

  if (response.ok && contentType && contentType.includes('application/json')) {
    return response.json()
  }

  throw new Error('Une erreur est survenue')
}

export function getEntreprises(q) {
  return _fetch(`${API_SIRENE_URL}/search?q=${q}`)
}
