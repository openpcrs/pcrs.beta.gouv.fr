import PropTypes from 'prop-types'
import Image from 'next/image'

import {getPostsByPage} from '@/lib/blog'

import Page from '@/layouts/main'

import BlogPagination from '@/components/blog-pagination'
import BlogCard from '@/components/blog-card'

const Blog = ({posts, pagination}) => (
  <Page title='Blog du PCRS' description='La liste complète des billets du blog autour de PCRS'>
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

    <div className='blog-posts-wrapper fr-px-15w'>
      <div className='posts-list'>
        {posts.map(post => <BlogCard key={post.id} post={post} />)}
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
          align-items: center;
          gap: 5em;
        }

        .posts-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 4em;
        }
      `}</style>
  </Page>
)

export async function getServerSideProps({query}) {
  const data = await getPostsByPage(query)

  return {
    props: {
      posts: data?.posts || null,
      pagination: data?.meta.pagination || null
    }
  }
}

Blog.propTypes = {
  posts: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired
}

export default Blog
