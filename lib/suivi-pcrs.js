const API_URL = process.env.NEXT_PUBLIC_URL || 'https://pcrs.beta.gouv.fr'

async function request(url, options) {
  const res = await fetch(`${API_URL}${url}`, options)

  if (res.status === 204) {
    return res
  }

  if (!res.ok) {
    const {message} = await res.json()
    throw new Error(message)
  }

  return res.json()
}

function buildOptions({method, token, body}) {
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

export async function getProject(id, token) {
  const options = buildOptions({method: 'GET', token})

  return request(`/projets/${id}`, options)
}

export async function postSuivi(suivi, token) {
  const options = buildOptions({method: 'POST', token, body: suivi})

  return request('/projets', options)
}

export async function editProject(suivi, id, token) {
  const options = buildOptions({method: 'PUT', token, body: suivi})

  return request(`/projets/${id}`, options)
}

export async function deleteSuivi(id, token) {
  const options = buildOptions({method: 'DELETE', token})

  return request(`/projets/${id}`, options)
}

export async function getCreators(token) {
  const options = buildOptions({method: 'GET', token})

  return request('/creators-emails', options)
}

export async function getCreator(token, creatorId) {
  const options = buildOptions({method: 'GET', token})

  return request(`/creators-emails/${creatorId}`, options)
}

export async function addCreator(token, creator) {
  const options = buildOptions({method: 'POST', token, body: creator})

  return request('/creators-emails', options)
}

export async function editCreator(token, emailId, creator) {
  const options = buildOptions({method: 'PUT', token, body: creator})

  return request(`/creators-emails/${emailId}`, options)
}

export async function deleteCreator(emailId, token) {
  const options = buildOptions({method: 'DELETE', token})

  return request(`/creators-emails/${emailId}`, options)
}

export async function getAdministrators(token) {
  const options = buildOptions({method: 'GET', token})

  return request('/administrators', options)
}

export async function addAdministator(token, administrator) {
  const options = buildOptions({method: 'POST', token, body: administrator})

  return request('/administrators', options)
}

export async function editAdministator(token, adminId, administrator) {
  const options = buildOptions({method: 'PUT', token, body: administrator})

  return request(`/administrators/${adminId}`, options)
}

export async function deleteAdministrator(adminId, token) {
  const options = buildOptions({method: 'DELETE', token})

  return request(`/administrators/${adminId}`, options)
}

export async function resetEditCode(projetId, token) {
  const options = buildOptions({method: 'GET', token})

  return request(`/projets/${projetId}/renew-editor-key`, options)
}

export async function getAllChanges(token) {
  const options = buildOptions({method: 'GET', token})

  return request('/report', options)
}
