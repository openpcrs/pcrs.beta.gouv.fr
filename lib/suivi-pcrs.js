import {maxBy} from 'lodash-es'

async function request(url, options) {
  const res = await fetch(`${url}`, options)

  if (res.status === 204) {
    return res
  }

  if (!res.ok) {
    const {message} = await res.json()
    throw new Error(message)
  }

  return res.json()
}

function buildOptions(method, token, body) {
  const options = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }

  if (token) {
    options.headers.Authorization = `Token ${token}`
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  return options
}

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

export async function getProject(id, token) {
  const options = buildOptions('GET', token)

  return request(`/projets/${id}`, options)
}

export async function postSuivi(suivi, token) {
  const options = buildOptions('POST', token, suivi)

  return request('/projets', options)
}

export async function editProject(suivi, id, token) {
  const options = buildOptions('PUT', token, suivi)

  return request(`/projets/${id}`, options)
}

export async function deleteSuivi(id, token) {
  const options = buildOptions('DELETE', token)

  return request(`/projets/${id}`, options)
}

export async function getCreators(token) {
  const options = buildOptions('GET', token)

  return request('/creator-emails', options)
}

export async function getCreator(token, creatorId) {
  const options = buildOptions('GET', token)

  return request(`/creator-email/${creatorId}`, options)
}

export async function addCreator(token, creator) {
  const options = buildOptions('POST', token, creator)

  return request('/creator-emails', options)
}

export async function deleteCreator(emailId, token) {
  const options = buildOptions('DELETE', token)

  return request(`/creator-email/${emailId}`, options)
}

export async function getAdministrators(token) {
  const options = buildOptions('GET', token)

  return request('/administrators', options)
}

export async function addAdministator(token, administrator) {
  const options = buildOptions('POST', token, administrator)

  return request('/administrators', options)
}

export async function deleteAdministrator(adminId, token) {
  const options = buildOptions('DELETE', token)

  return request(`/administrators/${adminId}`, options)
}

export async function resetEditCode(projetId, token) {
  const options = buildOptions('POST', token)

  return request(`/projets/${projetId}/renew-editor-key`, options)
}

export async function getAllChanges(token) {
  const options = buildOptions('GET', token)

  return request('/report', options)
}
