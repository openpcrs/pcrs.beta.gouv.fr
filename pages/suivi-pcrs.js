import {useContext} from 'react'

import Page from '@/layouts/main.js'
import {Desktop, Mobile} from '@/layouts/map.js'

import DeviceContext from '@/contexts/device.js'

const PcrsMap = () => {
  const {isMobileDevice} = useContext(DeviceContext)
  const Layout = isMobileDevice ? Mobile : Desktop

  return (
    <Page
      title='Carte des PCRS'
      description='Carte de déploiement des PCRS'
      hasFooter={false}
    >
      <Layout />
    </Page>
  )
}

export default PcrsMap

