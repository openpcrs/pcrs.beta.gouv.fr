import HttpError from './http-error.js'

export async function getProject(id) {
  try {
    const response = await fetch(`/projets/${id}`, {
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

