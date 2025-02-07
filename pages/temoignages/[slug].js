/* eslint-disable camelcase */
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import Image from 'next/image'

import {getSinglePost} from '@/lib/blog-static.js'
import {dateWithDay} from '@/lib/date-utils.js'

import Page from '@/layouts/main.js'

const Post = dynamic(() => import('@/components/post.js'), {
  ssr: false
})

const Temoignage = ({testimony}) => {
  const {title, published_at, feature_image, feature_image_alt, feature_image_caption} = testimony

  return (
    <Page title={title} description={`Témoignage ${testimony.title} du ${dateWithDay(testimony.published_at)}`}>
      <div className='blog-feature-image-container'>
        <Image
          src={feature_image || '/images/illustrations/blog_fallback.svg'}
          height={30}
          width={1000}
          className='blog-feature-image'
          style={{
            width: '100%',
            height: '300px',
            objectFit: 'cover'
          }}
          alt={feature_image_alt || ''}
          aria-hidden='true'
        />
        <div className='caption fr-pr-1w fr-text--sm'>{feature_image_caption || ''}</div>
      </div>

      <Post {...testimony} baseUrl='/temoignages' />

      <style jsx>{`
        .blog-feature-image-container {
          box-shadow: none;
          height: fit-content;
        }

        .caption {
          text-align: end;
          font-style: italic;
        }
      `}</style>
    </Page>
  )
}

export async function getServerSideProps(context) {
  const testimony = await getSinglePost(context.params.slug)

  return {
    props: {testimony}
  }
}

Temoignage.propTypes = {
  testimony: PropTypes.object.isRequired
}

export default Temoignage
