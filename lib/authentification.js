import HttpError from './http-error.js'

export async function authentification(token) {
  try {
    const response = await fetch('/me', {
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
  } catch {
    throw new HttpError()
  }
}
