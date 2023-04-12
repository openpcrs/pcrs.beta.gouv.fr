import {useState, useContext} from 'react'
import PropTypes from 'prop-types'

import DeviceContext from '@/contexts/device.js'

import Meta from '@/components/meta.js'
import Header from '@/components/header.js'
import Footer from '@/components/footer.js'

const Page = ({title, description, image, hasFooter, children}) => {
  const {isMobileDevice} = useContext(DeviceContext)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className='page-content'>
      <Meta title={title} description={description} image={image} />
      <Header
        isMobileDevice={isMobileDevice}
        handleMobileMenu={setIsMobileMenuOpen}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <main>
        {children}
      </main>

      {hasFooter && (
        <Footer />
      )}

      <style jsx>{`
        .page-content {
          overflow: ${isMobileDevice && isMobileMenuOpen ? 'hidden' : 'scroll'};
        }

        main {
          flex: 1;
          box-sizing: border-box;
        }
      `}
      </style>
    </div>
  )
}

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
