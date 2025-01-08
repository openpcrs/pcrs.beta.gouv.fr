import blogData from '../data/blog.json'
import blogTags from '../data/blog_tags.json'

const LIMIT = 9

export async function getPosts(props) {
  let posts;
  ({posts} = blogData.posts)

  if (props?.tags) {
    const tagsList = props.tags.split(',')
    posts = posts.filter(post => post.tags.some(tag => tagsList.includes(tag)).length > 0)
  }

  if (props?.page) {
    posts = posts.slice(LIMIT * (props.page - 1), LIMIT * props.page)
  }

  return posts
}

export async function getSinglePost(slug) {
  const posts = blogData.posts.filter(post => post.slug === slug)

  if (posts) {
    return posts[0]
  }

  return null
}

export async function getTags() {
  return blogTags
}
