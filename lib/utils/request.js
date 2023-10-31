export async function request(url, options) {
  const res = await fetch(url, options)

  if (res.status === 204 || res.status === 202) {
    return res
  }

  if (!res.ok) {
    const {message} = await res.json()
    throw new Error(message)
  }

  return res.json()
}

export async function formRequest(url, options) {
  const res = await fetch(url, options)

  if (res.status === 204) {
    return res
  }

  const content = await res.json()

  if (!res.ok) {
    return {error: content}
  }

  return {data: content}
}
