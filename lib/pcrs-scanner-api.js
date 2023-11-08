import {request} from './utils/request.js'

const API_PCRS_SCANNER = process.env.NEXT_PUBLIC_API_PCRS_SCANNER || 'https://pcrs-scanner.osc-fr1.scalingo.io'

const defaultOptions = {
  headers: {'content-type': 'application/json'},
  mode: 'cors',
  method: 'GET'
}

export async function getStockage(stockageId) {
  const options = {...defaultOptions}
  return request(`${API_PCRS_SCANNER}/storages/${stockageId}`, options)
}

export async function getStockageGeoJSON(stockageId) {
  const options = {...defaultOptions}
  return request(`${API_PCRS_SCANNER}/storages/${stockageId}/geojson`, options)
}

export async function getStockageData(stockageId) {
  const options = {...defaultOptions}
  return request(`${API_PCRS_SCANNER}/storages/${stockageId}/data`, options)
}
