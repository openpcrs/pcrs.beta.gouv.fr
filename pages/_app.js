import React from 'react'
import PropTypes from 'prop-types'

import '@/styles/global.css'
import '@gouvfr/dsfr/dist/dsfr/dsfr.min.css'
import '@gouvfr/dsfr/dist/utility/icons/icons.main.css'

const App = ({Component, pageProps}) => (
  <React.StrictMode>
    <Component {...pageProps} />
  </React.StrictMode>
)

App.propTypes = {
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.object.isRequired
}

export default App
