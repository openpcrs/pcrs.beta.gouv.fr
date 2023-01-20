import PropTypes from 'prop-types'
import Image from 'next/image'

import colors from '@/styles/colors.js'

import {getPosts} from '@/lib/blog.js'

import Page from '@/layouts/main.js'

import PostCard from '@/components/post-card.js'
import Pagination from '@/components/pagination.js'

const Temoignages = ({testimonies, pagination}) => (
  <Page title='Témoignages autour du PCRS' description='La liste complète des témoignages autour du PCRS'>
    {testimonies ? (
      <div>
        <div className='blog-header fr-my-5w'>
          <Image
            src='/images/illustrations/testimony_illustration.png'
            height={200}
            width={200}
            alt=''
            aria-hidden='true'
          />
          <h2 className='fr-mt-5w fr-mb-15w fr-mb-0'>Témoignages autour du PCRS</h2>
        </div>

        <div>
          <div className='fr-mb-6w fr-grid-row fr-grid-row--center fr-px-1w fr-px-md-7w fr-px-lg-3w'>
            {testimonies.length > 0 ? (
              testimonies.map(post => (
                <div key={post.id} className='fr-col-12 fr-col-lg-3 fr-m-3w'>
                  <PostCard isTestimony post={post} />
                </div>
              ))
            ) : (
              <div className='no-article'>Aucun témoignage n’est disponible pour le moment</div>
            )}
          </div>
          <Pagination {...pagination} />
        </div>
      </div>
    ) : (
      <div className='unavailable fr-p-5w'>
        <Image
          src='/images/illustrations/500.png'
          height={456}
          width={986}
          alt=''
          style={{
            width: '100%',
            maxWidth: '500px',
            height: 'auto'
          }}
        />

        <div className='fr-pt-8w'>
          <p>
            <b className='fr-h3'>La liste des témoignages est actuellement indisponible</b><br />
            <i>Merci de réessayer ultérieurement</i>
          </p>
        </div>
      </div>
    )}

    <style jsx>{`
      .blog-header {
        text-align: center;
      }

      .unavailable {
        text-align: center;
        color: ${colors.darkgrey};
      }

      .no-article {
        font-style: italic;
      }
    `}</style>
  </Page>
)

export async function getServerSideProps({query}) {
  const data = await getPosts({...query, tags: 'temoignage'})

  return {
    props: {
      testimonies: data?.posts,
      pagination: data?.meta.pagination
    }
  }
}

Temoignages.propTypes = {
  testimonies: PropTypes.array,
  pagination: PropTypes.object
}

Temoignages.defaultProps = {
  testimonies: null,
  pagination: null
}

export default Temoignages
