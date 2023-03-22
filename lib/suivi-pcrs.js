import HttpError from './http-error.js'

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
