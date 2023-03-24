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
    const contentType = response.headers.get('content-type')

    if (!response.ok) {
      throw new HttpError(response)
    }

    if (contentType && contentType.includes('application/json')) {
      return response.json()
    }
  } catch {
    throw new HttpError()
  }
}
