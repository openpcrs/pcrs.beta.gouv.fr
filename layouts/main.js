import PropTypes from 'prop-types'

import Meta from '@/components/meta.js'
import Header from '@/components/header.js'
import Footer from '@/components/footer.js'

const Page = ({title, description, image, hasFooter, children}) => (
  <>
    <Meta title={title} description={description} image={image} />
    <Header />

    <main>
      {children}
    </main>

    {hasFooter && (
      <Footer />
    )}

    <style jsx>{`
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
  image: PropTypes.string,
  hasFooter: PropTypes.bool,
  children: PropTypes.node
}

Page.defaultProps = {
  title: 'Accompagnement national du PCRS',
  description: 'Accompagner et diffuser les projets locaux de PCRS en cours et à venir',
  hasFooter: true,
  image: null
}

export default Page
