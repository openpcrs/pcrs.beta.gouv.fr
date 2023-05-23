import HttpError from './http-error.js'

export async function authentificationRole(token) {
  try {
    const response = await fetch('/me', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`
      }
    })

    return response.json()
  } catch {
    throw new HttpError()
  }
}

export async function askCode(email) {
  try {
    const response = await fetch('/ask-code', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email})
    })

    if (!response.ok) {
      return response.json()
    }
  } catch (error) {
    throw new HttpError(error)
  }
}

export async function checkCode(email, pinCode) {
  try {
    const response = await fetch('/check-code', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, pinCode})
    })

    return response.json()
  } catch (error) {
    throw new HttpError(error)
  }
}
