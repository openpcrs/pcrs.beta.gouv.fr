import {useState, useContext, useCallback, useEffect} from 'react'

import {useRouter} from 'next/router'
import Page from '@/layouts/main.js'
import {getProject} from '@/lib/suivi-pcrs.js'
import SuiviPCRSMapLayout from '@/layouts/suivi-pcrs-map-layout/index.js'

import AuthentificationContext from '@/contexts/authentification-token.js'
import AuthentificationModal from '@/components/suivi-form/authentification/authentification-modal.js'
import CenteredSpinner from '@/components/centered-spinner.js'

const PcrsMap = () => {
  const router = useRouter()

  const {userRole, token} = useContext(AuthentificationContext)

  const [isOpen, setIsOpen] = useState(false)
  const [projet, setProjet] = useState()
  const [projets, setProjets] = useState()
  const [geometry, setGeometry] = useState()

  const [isAuthentificationModalOpen, setIsAuthentificationModalOpen] = useState(false)

  const handleModal = () => setIsAuthentificationModalOpen(!isAuthentificationModalOpen)
  const handleNewProject = () => token ? router.push('/formulaire-suivi') : handleModal()

  const resetProjet = () => {
    setProjet(null)
  }

  const selectProjets = useCallback(async projetsIds => {
    try {
      const promises = projetsIds.map(id => getProject(id, token))
      const projets = await Promise.all(promises)

      setProjet(projets[0])
      setProjets(projets)
      setIsOpen(true)
    } catch {
      router.push('/404')
    }
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
        <SuiviPCRSMapLayout
          selectProjets={selectProjets}
          handleTitleClick={handleTitleClick}
          projet={projet}
          projets={projets}
          geometry={geometry}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleNewProject={handleNewProject}
          resetProjet={resetProjet}
          onProjetChange={handleProjet}
        />
      ) : (
        <CenteredSpinner />
      )}

      {isAuthentificationModalOpen && userRole !== 'admin' && (
        <AuthentificationModal handleModalClose={handleModal} />
      )}
    </Page>
  )
}

export default PcrsMap

