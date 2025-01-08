const LIMIT = 9
const INCLUDE = 'authors,tags'

import blogData from '../data/blog.json'
import blogTags from '../data/blog_tags.json'

const options = {
  method: 'GET',
  headers: {'content-type': 'application/json'},
  mode: 'cors'
}

export async function getPosts(props) {
  let posts = blogData.posts
  if (props?.tags){
    let tagsList = props.tags.split(',');
    posts = posts.filter(post => post.tags.filter(tag => {tagsList.includes(tag)}).length > 0)
  }
  if (props?.page){
    // TODO
  }

  return posts;
}

export async function getSinglePost(slug) {
  let posts = blogData.posts.filter(post => post.slug == slug)
  if (posts){
    return posts[0]
  }
  return null;
}

export async function getTags() {
  return blogTags;
}
