import HttpError from './http-error.js'

const API_DECOUPAGE_ADMIN_URL = process.env.NEXT_PUBLIC_API_DECOUPAGE_ADMIN_URL || 'https://geo.api.gouv.fr'

export async function getJsonFromApi(url, options = {}) {
  const fetchOptions = {
    mode: 'cors',
    method: 'GET'
  }

  if (options.signal) {
    fetchOptions.signal = options.signal
  }

  const response = await fetch(url, fetchOptions)
  const contentType = response.headers.get('content-type')

  if (!response.ok) {
    throw new HttpError(response)
  }

  if (response.ok && contentType && contentType.includes('application/json')) {
    return response.json()
  }

  throw new Error('Une erreur est survenue')
}

export function getPerimetersByName(nom, type, signal) {
  return getJsonFromApi(`${API_DECOUPAGE_ADMIN_URL}/${type}s?nom=${nom}&limit=5`, {signal})
}

export function getPerimetersByCode(code, type, signal) {
  return getJsonFromApi(`${API_DECOUPAGE_ADMIN_URL}/${type}s/${code}`, {signal})
}
