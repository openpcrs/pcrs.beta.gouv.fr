import {useState, useContext, useCallback, useMemo, useEffect} from 'react'

import {useRouter} from 'next/router'
import Page from '@/layouts/main.js'
import {getProject} from '@/lib/suivi-pcrs.js'
import {Desktop, Mobile} from '@/layouts/map.js'

import DeviceContext from '@/contexts/device.js'
import AuthentificationContext from '@/contexts/authentification-token.js'
import AuthentificationModal from '@/components/suivi-form/authentification/authentification-modal.js'

const PcrsMap = () => {
  const router = useRouter()

  const {isMobileDevice} = useContext(DeviceContext)
  const {userRole, token} = useContext(AuthentificationContext)

  const Layout = useMemo(() => isMobileDevice ? Mobile : Desktop, [isMobileDevice])
  const [isOpen, setIsOpen] = useState(false)
  const [projet, setProjet] = useState()
  const [projets, setProjets] = useState()
  const [geometry, setGeometry] = useState()

  const [isAuthentificationModalOpen, setIsAuthentificationModalOpen] = useState(false)

  const handleModal = () => setIsAuthentificationModalOpen(!isAuthentificationModalOpen)
  const handleNewProject = () => token ? router.push('/formulaire-suivi') : handleModal()

  const handleSelectProjet = useCallback(async e => {
    try {
      setProjets([])
      const promises = e.features.map(f => getProject(f.properties._id, token))
      const projets = await Promise.all(promises)

      setProjets(prevProjets => [...prevProjets, ...projets])
    } catch {
      throw new Error('Projet introuvable')
    }

    setIsOpen(true)
  }, [token])

  const handleTitleClick = () => {
    if (projet) {
      setIsOpen(!isOpen)
    }
  }

  const handleProjet = e => {
    const selectedProjet = projets.find(p => p._id === e.target.value)
    setProjet(selectedProjet)
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
        handleSelectProjet={handleSelectProjet}
        handleTitleClick={handleTitleClick}
        projet={projet}
        projets={projets}
        geometry={geometry}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleNewProject={handleNewProject}
        onProjetChange={handleProjet}
      />

      {isAuthentificationModalOpen && userRole !== 'admin' && (
        <AuthentificationModal handleModalClose={handleModal} />
      )}
    </Page>
  )
}

export default PcrsMap

