const API_PCRS_SCANNER = process.env.NEXT_PUBLIC_API_PCRS_SCANNER || 'https://pcrs-scanner.osc-fr1.scalingo.io'

const defaultOptions = {
  headers: {'content-type': 'application/json'},
  mode: 'cors'
}

async function request(url, options) {
  const res = await fetch(`${API_PCRS_SCANNER}${url}`, options)

  if (res.status === 204) {
    return res
  }

  if (!res.ok) {
    const {message} = await res.json()
    throw new Error(message)
  }

  return res.json()
}

export async function getStorage(storageId) {
  const options = {method: 'GET', ...defaultOptions}
  return request(`/storages/${storageId}`, options)
}

export async function getStorageGeoJSON(storageId) {
  const options = {method: 'GET', ...defaultOptions}
  return request(`/storages/${storageId}/geojson`, options)
}

