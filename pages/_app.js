import React from 'react'
import PropTypes from 'prop-types'

import {DeviceContextProvider} from '@/contexts/device.js'
import {AuthentificationContextProvider} from '@/contexts/authentification-token.js'

import '@/styles/global.css'
import '@gouvfr/dsfr/dist/dsfr/dsfr.min.css'
import '@gouvfr/dsfr/dist/core/core.min.css'
import '@gouvfr/dsfr/dist/utility/icons/icons-system/icons-system.min.css'
import '@gouvfr/dsfr/dist/utility/icons/icons-document/icons-document.min.css'
import '@gouvfr/dsfr/dist/utility/icons/icons-development/icons-development.min.css'
import '@gouvfr/dsfr/dist/utility/icons/icons-business/icons-business.min.css'
import '@gouvfr/dsfr/dist/utility/icons/icons-device/icons-device.min.css'
import '@gouvfr/dsfr/dist/utility/icons/icons-user/icons-user.min.css'
import '@gouvfr/dsfr/dist/utility/icons/icons-map/icons-map.min.css'
import '@gouvfr/dsfr/dist/utility/icons/icons-communication/icons-communication.min.css'
import '@gouvfr/dsfr/dist/utility/icons/icons-buildings/icons-buildings.min.css'
import '@gouvfr/dsfr/dist/utility/icons/icons-design/icons-design.min.css'

const App = ({Component, pageProps}) => (
  <React.StrictMode>
    <DeviceContextProvider>
      <AuthentificationContextProvider>
        <Component {...pageProps} />
      </AuthentificationContextProvider>
    </DeviceContextProvider>
  </React.StrictMode>
)

App.propTypes = {
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.object.isRequired
}

export default App
