import {useState, useContext, useCallback, useMemo, useEffect} from 'react'

import {useRouter} from 'next/router'
import Page from '@/layouts/main.js'
import {getProject} from '@/lib/suivi-pcrs.js'
import {Desktop, Mobile} from '@/layouts/map.js'

import DeviceContext from '@/contexts/device.js'
import AuthentificationContext from '@/contexts/authentification-token.js'
import AuthentificationModal from '@/components/suivi-form/authentification/authentification-modal.js'
import CenteredSpinnder from '@/components/centered-spinner.js'

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

  const selectProjets = useCallback(async projetsIds => {
    setProjet(null)
    setProjets([])

    try {
      const promises = projetsIds.map(id => getProject(id, token))
      const [projet, ...projets] = await Promise.all(promises)

      setProjet(projet)
      setProjets(prevProjets => [...prevProjets, projet, ...projets])
    } catch {
      router.push('/404')
    }

    setIsOpen(true)
  }, [token, router])

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
      {geometry ? (
        <Layout
          selectProjets={selectProjets}
          handleTitleClick={handleTitleClick}
          projet={projet}
          projets={projets}
          geometry={geometry}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleNewProject={handleNewProject}
          onProjetChange={handleProjet}
        />
      ) : (
        <CenteredSpinnder />
      )}

      {isAuthentificationModalOpen && userRole !== 'admin' && (
        <AuthentificationModal handleModalClose={handleModal} />
      )}
    </Page>
  )
}

export default PcrsMap

