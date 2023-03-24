import HttpError from './http-error.js'

const API_DECOUPAGE_ADMIN_URL = process.env.NEXT_PUBLIC_API_DECOUPAGE_ADMIN_URL || 'https://geo.api.gouv.fr'

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

export function getPerimetersByName(nom, type) {
  return _fetch(`${API_DECOUPAGE_ADMIN_URL}/${type}s?nom=${nom}&limit=5`)
}

export function getPerimetersByCode(code, type) {
  return _fetch(`${API_DECOUPAGE_ADMIN_URL}/${type}s/${code}`)
}
