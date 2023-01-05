import PropTypes from 'prop-types'
import Image from 'next/image'

import {getPosts, getTags} from '@/lib/blog'

import Page from '@/layouts/main'

import BlogPagination from '@/components/blog/blog-pagination'
import BlogCard from '@/components/blog/blog-card'
import BlogTags from '@/components/blog/blog-tags'

const Blog = ({posts, tags, tagsList, pagination}) => (
  <Page title='Blog du PCRS' description='La liste complète des billets du blog autour du PCRS'>
    <div className='blog-header fr-my-5w'>
      <Image
        src='/images/illustrations/blog_illustration.png'
        height={200}
        width={200}
        alt=''
        aria-hidden='true'
      />
      <h2 className='fr-mt-5w fr-mb-0'>Blog du PCRS</h2>
    </div>

    <div className='blog-posts-wrapper'>
      {tagsList.length > 0 && <BlogTags selectedTags={tags} tagsList={tagsList} />}

      <div className='posts-list'>
        {posts.length > 0 && posts.map(post => <BlogCard key={post.id} post={post} />)}
        {(posts.length === 0 && tags.length === 0) && <div className='no-article'>Aucun article de blog n’est disponible</div>}
        {(posts.length === 0 && tags.length > 0) && <div className='no-article'>Aucun article ne contient ces tags</div>}
      </div>

      <BlogPagination {...pagination} />
    </div>

    <style jsx>{`
      .blog-header {
        text-align: center;
      }

      .blog-posts-wrapper {
        display: flex;
        flex-direction: column;
        gap: 5em;
        margin: 1em 20%;
      }

      .posts-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
        gap: 4em;
      }

      .no-article {
        font-style: italic;
      }
    `}</style>
  </Page>
)

export async function getServerSideProps({query}) {
  const data = await getPosts(query)
  const tags = query?.tags || null
  const tagsList = await getTags()

  return {
    props: {
      posts: data?.posts || null,
      pagination: data?.meta.pagination || null,
      tags: tags?.split(',') || [],
      tagsList
    }
  }
}

Blog.propTypes = {
  posts: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
  tagsList: PropTypes.array.isRequired,
  tags: PropTypes.array
}

Blog.defaultProps = {
  tags: null
}

export default Blog
