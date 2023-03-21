import HttpError from './http-error.js'

const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN

export async function postSuivi(suivi) {
  try {
    const response = await fetch('http://localhost:3000/projets', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token ${ADMIN_TOKEN}`
      },
      body: JSON.stringify(suivi)
    })

    return response.json()
  } catch (error) {
    throw new HttpError(error)
  }
}
