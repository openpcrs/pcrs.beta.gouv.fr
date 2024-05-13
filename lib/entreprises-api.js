import HttpError from './http-error.js'

const API_ENTREPRISES_URL = process.env.NEXT_PUBLIC_API_ENTREPRISES_URL || 'https://recherche-entreprises.api.gouv.fr'

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

export function getEntreprises(q, signal) {
  return getJsonFromApi(`${API_ENTREPRISES_URL}/search?q=${q}&mtm_campaign=pcrs-beta-gouv`, signal)
}
