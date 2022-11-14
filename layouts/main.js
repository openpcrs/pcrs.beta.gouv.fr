import PropTypes from 'prop-types'
import Head from 'next/head'

import Header from '@/components/header'
import Footer from '@/components/footer'

const SITE_NAME = 'pcrs.beta.gouv.fr'
const Page = ({title, description, children}) => (
  <>
    <Head>
      <title>{title} | {SITE_NAME}</title>
      <meta name='description' content={description} />
      <meta name='twitter:site' content={SITE_NAME} />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='og:title' content={title} />
      <meta name='og:description' content={description} />
      <meta name='og:url' content={SITE_NAME} />
      <meta name='og:site_name' content={SITE_NAME} />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <link rel='shortcut icon' href='/images/favicon.ico' />
    </Head>

    <div className='page-wrapper'>
      <Header />

      <main>
        {children}
      </main>

      <Footer />
    </div>

    <style jsx>{`
      .page-wrapper {
        scroll-behavior: smooth;
        overflow: scroll;
        position: relative;
      }

      main {
        flex: 1;
        box-sizing: border-box;
      }
    `}
    </style>
  </>
)

Page.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node
}

Page.defaultProps = {
  title: 'Accompagnement national du PCRS',
  description: 'Concentrer la connaissance et restituer la consistance des projets PCRS en cours et des territoires à prospecter.'
}

export default Page
