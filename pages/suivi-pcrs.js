import {useState, useContext, useCallback, useMemo} from 'react'

import Page from '@/layouts/main.js'
import {getProject} from '@/lib/suivi-pcrs.js'
import {Desktop, Mobile} from '@/layouts/map.js'

import DeviceContext from '@/contexts/device.js'

const PcrsMap = () => {
  const {isMobileDevice} = useContext(DeviceContext)
  const Layout = useMemo(() => isMobileDevice ? Mobile : Desktop, [isMobileDevice])
  const [isOpen, setIsOpen] = useState(false)
  const [projet, setProjet] = useState()

  const handleClick = useCallback(async e => {
    const projet = await getProject(e.features[0].properties._id)

    setProjet(projet)
    setIsOpen(true)
  }, [])

  const handleTitleClick = () => {
    if (projet) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <Page
      title='Carte des PCRS'
      description='Carte de déploiement des PCRS'
      hasFooter={false}
    >
      <Layout
        handleClick={handleClick}
        handleTitleClick={handleTitleClick}
        projet={projet}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </Page>
  )
}

export default PcrsMap

