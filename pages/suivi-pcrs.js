import {useState, useContext, useCallback, useMemo, useEffect} from 'react'

import Page from '@/layouts/main.js'
import {getProject} from '@/lib/suivi-pcrs.js'
import {Desktop, Mobile} from '@/layouts/map.js'

import DeviceContext from '@/contexts/device.js'

const PcrsMap = () => {
  const {isMobileDevice} = useContext(DeviceContext)
  const Layout = useMemo(() => isMobileDevice ? Mobile : Desktop, [isMobileDevice])
  const [isOpen, setIsOpen] = useState(false)
  const [projet, setProjet] = useState()
  const [projets, setProjets] = useState()
  const [geometry, setGeometry] = useState()

  const handleClick = useCallback(async e => {
    setProjets([])
    const promises = e.features.map(f => getProject(f.properties._id))
    const projets = await Promise.all(promises)
    setProjets(prevProjets => [...prevProjets, ...projets])

    setIsOpen(true)
  }, [])

  const handleTitleClick = () => {
    if (projet) {
      setIsOpen(!isOpen)
    }
  }

  useEffect(() => {
    if (projets && projets.length > 0) {
      setProjet(projets[0])
    }
  }, [projets])

  useEffect(() => {
    async function getGeometry() {
      const geometry = await fetch('/projets/geojson').then(res => res.json())
      setGeometry({
        type: 'FeatureCollection',
        features: geometry
      })
    }

    getGeometry()
  }, [])

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
        projets={projets}
        geometry={geometry}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onProjetChange={e => setProjet(projets[e.target.value])}
      />
    </Page>
  )
}

export default PcrsMap

