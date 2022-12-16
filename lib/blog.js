const URL = process.env.NEXT_PUBLIC_GHOST_URL
const KEY = process.env.GHOST_KEY
const LIMIT = 9
const INCLUDE = 'authors,tags'
const FULL_URL = `${URL}/ghost/api/v3/content/posts?key=${KEY}&limit=${LIMIT}&include=${INCLUDE}`
const UNLIMITED_POSTS_URL = `${URL}/ghost/api/v3/content/posts?key=${KEY}&limit=all`

const options = {
  method: 'GET',
  headers: {'content-type': 'application/json'},
  mode: 'cors'
}

function buildQuery(props) {
  if (props?.page && props.page.length > 0) {
    return `${FULL_URL}&page=${props.page}`
  }

  return `${FULL_URL}`
}

export async function getPosts() {
  try {
    const res = await fetch(UNLIMITED_POSTS_URL, options)
    if (res.ok) {
      const data = await res.json()
      return data
    }
  } catch (error) {
    console.log(error)
  }

  return null
}

export async function getPostsByPage(props) {
  const query = buildQuery(props)

  try {
    const res = await fetch(query, options)

    if (res.ok) {
      const data = await res.json()
      return data
    }
  } catch (error) {
    console.log(error)
  }

  return null
}

export async function getSinglePost(slug) {
  try {
    const res = await fetch(`${URL}/ghost/api/v3/content/posts/slug/${slug}/?key=${KEY}&include=authors`)

    if (res.ok) {
      const data = await res.json()
      return data.posts[0]
    }
  } catch (error) {
    console.log(error)
  }

  return null
}
