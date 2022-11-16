import PropTypes from 'prop-types'
import Head from 'next/head'
import prune from 'underscore.string/prune'

const SITE_NAME = 'pcrs.beta.gouv.fr'

const Meta = ({title, description, type, image}) => {
  description = prune(description, 160, '…')

  return (
    <Head>
      {title ? <title>{title} | {SITE_NAME}</title> : <title>{SITE_NAME}</title>}
      <link rel='icon' type='image/x-icon' href='/images/favicon.ico' />

      {/* Search Engine */}
      <meta name='description' content={description} />
      <meta name='image' content={image || '/images/logos/card-meta.png'} />

      {/* Twitter */}
      <meta name='twitter:card' content='summary' />
      <meta name='twitter:site' content='@pcrsbeta' />
      <meta name='twitter:creator' content='@pcrsbeta' />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content='/images/logos/card-meta.png' />

      {/* Open Graph meta (Facebook, Pinterest) */}
      <meta property='og:title' content={title} />
      <meta property='og:type' content={type} />
      <meta property='og:description' content={description} />
      <meta property='author' content='pcrs.beta.gouv.fr' />
      <meta property='og:image' content='/images/logos/opengraph-meta.png' />
    </Head>
  )
}

Meta.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  type: PropTypes.oneOf([
    'website',
    'article'
  ]),
  image: PropTypes.string
}

Meta.defaultProps = {
  type: 'website',
  image: null
}

export default Meta
