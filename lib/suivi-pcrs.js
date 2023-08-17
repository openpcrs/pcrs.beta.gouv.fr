import {maxBy} from 'lodash-es'

import HttpError from './http-error.js'

const PUBLIC_URL = process.env.NEXT_PUBLIC_URL
const PORT = process.env.NEXT_PUBLIC_PORT || 3000

export function findClosestEtape(etapes) {
  if (etapes.some(etape => etape.date_debut)) {
    const now = new Date()

    const filteredLaterSteps = etapes.filter(etape => new Date(etape.date_debut) <= now)
    if (filteredLaterSteps.length > 0) {
      return maxBy(filteredLaterSteps, etape => new Date(etape.date_debut))
    }

    return etapes[0]
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

export async function getProject(id, token) {
  const headers = token ? {'content-type': 'application/json', Authorization: `Token ${token}`} : {'content-type': 'application/json'}

  try {
    const response = await fetch(`${baseUrl}/projets/${id}`, {
      method: 'GET',
      headers
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

export async function getCreators(token) {
  try {
    const response = await fetch('/creators-emails', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`
      }
    })

    if (!response.ok) {
      throw new HttpError(response)
    }

    return response.json()
  } catch (error) {
    throw new HttpError(error)
  }
}

export async function getCreator(token, creatorId) {
  try {
    const response = await fetch(`/creators-emails/${creatorId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`
      }
    })

    if (!response.ok) {
      throw new HttpError(response)
    }

    return response.json()
  } catch (error) {
    throw new HttpError(error)
  }
}

export async function addCreator(token, creator) {
  const response = await fetch('/creators-emails', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`
    },
    body: JSON.stringify(creator)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message)
  }

  return response.json()
}

export async function deleteCreator(emailId, token) {
  try {
    const response = await fetch(`/creators-emails/${emailId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`
      }
    })

    if (!response.ok) {
      throw new HttpError(response)
    }

    return response
  } catch (error) {
    throw new HttpError(error)
  }
}

export async function getAdministrators(token) {
  const response = await fetch('/administrators', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`
    }
  })

  if (!response.ok) {
    const {message} = await response.json()
    throw new Error(message)
  }

  return response.json()
}

export async function addAdministator(token, administrator) {
  const response = await fetch('/administrators', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`
    },
    body: JSON.stringify(administrator)
  })

  if (!response.ok) {
    const {message} = await response.json()
    throw new Error(message)
  }

  return response.json()
}

export async function deleteAdministrator(adminId, token) {
  const response = await fetch(`/administrators/${adminId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`
    }
  })

  if (!response.ok) {
    const {message} = await response.json()
    throw new Error(message)
  }

  return response
}

export async function resetEditCode(projetId, token) {
  try {
    const response = await fetch(`/projets/${projetId}/renew-editor-key`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`
      }
    })

    return response.json()
  } catch (error) {
    throw new HttpError(error)
  }
}

export async function getAllChanges(token) {
  const response = await fetch('/report', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`
    }
  })

  return response.json()
}
