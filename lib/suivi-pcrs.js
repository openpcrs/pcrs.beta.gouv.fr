import {maxBy} from 'lodash-es'

import HttpError from './http-error.js'

const PUBLIC_URL = process.env.NEXT_PUBLIC_URL
const PORT = process.env.NEXT_PUBLIC_PORT || 3000

export function findClosestEtape(etapes) {
  if (etapes.some(etape => etape.date_debut)) {
    const now = new Date()

    const filteredLaterSteps = etapes.filter(etape => new Date(etape.date_debut) <= now)
    return maxBy(filteredLaterSteps, etape => new Date(etape.date_debut))
  }

  // When "Etapes" has no date, use last one
  return etapes[etapes.length - 1]
}

function getBaseUrl() {
  if (PUBLIC_URL) {
    return PUBLIC_URL
  }

  return `http://localhost:${PORT}`
}

const baseUrl = getBaseUrl()

export async function getProject(id) {
  try {
    const response = await fetch(`${baseUrl}/projets/${id}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    })

    return response.json()
  } catch (error) {
    throw new HttpError(error)
  }
}

export async function postSuivi(suivi, token) {
  try {
    const response = await fetch('/projets', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`
      },
      body: JSON.stringify(suivi)
    })

    return response.json()
  } catch (error) {
    throw new HttpError(error)
  }
}

export async function editProject(suivi, id, token) {
  try {
    const response = await fetch(`/projets/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Token ${token}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify(suivi)
    })

    return response.json()
  } catch (error) {
    throw new HttpError(error)
  }
}

export async function deleteSuivi(id, token) {
  try {
    const response = await fetch(`/projets/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`
      }
    })

    return response
  } catch (error) {
    throw new HttpError(error)
  }
}

