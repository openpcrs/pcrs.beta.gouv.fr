import {createRoot} from 'react-dom/client' // eslint-disable-line n/file-extension-in-import
import {useEffect, useRef, useState, useContext, useCallback} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'
import {filter, some, debounce, flatMap, uniq, deburr} from 'lodash'

import maplibreGl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

import vector from './styles/vector.json'

import AuthentificationContext from '@/contexts/authentification-token.js'

import Popup from '@/components/map/popup.js'
import Legend from '@/components/map/legend.js'
import MapToolBox from '@/components/map/map-tool-box.js'
import AuthentificationModal from '@/components/suivi-form/authentification/authentification-modal.js'
import AutocompleteInput from '@/components/autocomplete-input.js'

const Map = ({handleSelectProjet, isMobile, geometry, projetId}) => {
  const {userRole, token} = useContext(AuthentificationContext)
  const router = useRouter()
  const [layout, setLayout] = useState('projets-fills')
  const [acteurSearchInput, setActeurSearchInput] = useState('')
  const [foundActeurs, setFoundActeurs] = useState([])
  const [matchingIds, setMatchingIds] = useState([])

  const [isAuthentificationModalOpen, setIsAuthentificationModalOpen] = useState(false)

  const handleModal = () => setIsAuthentificationModalOpen(!isAuthentificationModalOpen)
  const normalize = string => deburr(string?.toLowerCase())

  const mapNode = useRef()
  const mapRef = useRef()
  const selectedId = useRef()

  const popupRef = useRef(new maplibreGl.Popup({
    offset: 50,
    maxWidth: 'none',
    closeButton: false,
    closeOnClick: false
  }))
  const popupNode = document.createElement('div')
  const popupRoot = createRoot(popupNode)

  const handleMouseMove = useCallback(e => {
    let projet = null

    if (e.features.length > 0) {
      projet = e.features[0].properties

      popupRoot.render(
        <Popup
          key={projet.nom}
          projet={projet}
          numberOfProjets={e.features.length}
        />
      )

      popupRef.current
        .setLngLat(e.lngLat)
        .setDOMContent(popupNode)
        .addTo(mapRef.current)
    }
  }, [popupNode, popupRoot])

  const handleMouseLeave = () => {
    popupRef.current.remove()
  }

  useEffect(() => {
    const node = mapNode.current
    const maplibreMap = new maplibreGl.Map({
      container: node,
      style: vector,
      center: [1.7, 46.9],
      zoom: isMobile ? 4 : 5,
      attributionControl: false,
      maxZoom: 10,
      minZoom: 4
    })

    mapRef.current = maplibreMap

    const resizer = new ResizeObserver(() => maplibreMap.resize())
    resizer.observe(node)

    maplibreMap.addControl(new maplibreGl.NavigationControl())
    maplibreMap.addControl(new maplibreGl.AttributionControl({compact: true}), 'bottom-right')

    maplibreMap.on('click', 'projets-fills', e => {
      handleSelectProjet(e)
    })
    maplibreMap.on('click', 'projets-fills-nature', e => {
      handleSelectProjet(e)
    })

    if (!isMobile) {
      maplibreMap.on('mousemove', 'projets-fills', e => handleMouseMove(e))
      maplibreMap.on('mousemove', 'projets-fills-nature', e => handleMouseMove(e))
    }

    maplibreMap.on('mouseleave', 'projets-fills', () => handleMouseLeave())
    maplibreMap.on('mouseleave', 'projets-fills-nature', () => handleMouseLeave())

    maplibreMap.on('load', () => {
      maplibreMap.getSource('projetsData').setData(geometry)

      if (projetId) {
        maplibreMap.setFeatureState(
          {source: 'projetsData', id: projetId},
          {hover: true}
        )
      }
    })

    return () => {
      resizer.disconnect()
      maplibreMap.remove()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (mapRef?.current?.isStyleLoaded()) {
      if (layout === 'projets-fills-nature') {
        mapRef.current.setLayoutProperty('projets-fills-nature', 'visibility', 'visible')
        mapRef.current.setLayoutProperty('projets-fills', 'visibility', 'none')
      }

      if (layout === 'projets-fills') {
        mapRef.current.setLayoutProperty('projets-fills', 'visibility', 'visible')
        mapRef.current.setLayoutProperty('projets-fills-nature', 'visibility', 'none')
      }

      // Filter by actors when actor is selected
      mapRef.current.setFilter(layout, (matchingIds.length > 0 && foundActeurs.length > 0) ? ['in', ['get', '_id'], ['literal', matchingIds]] : null)
    }
  }, [layout, matchingIds, foundActeurs])

  useEffect(() => {
    // Search actors by name
    if (acteurSearchInput.length >= 2) {
      const fetchActeurs = debounce(() => {
        const flatActeurs = flatMap(geometry.features.map(f => f.properties), 'acteurs')
        const filteredActeurs = flatActeurs.filter(a => normalize(a)?.includes(normalize(acteurSearchInput))).slice(0, 4)

        setFoundActeurs(uniq(filteredActeurs))
      }, 300)
      fetchActeurs()
    } else {
      setFoundActeurs([])
      setMatchingIds([])
    }
  }, [acteurSearchInput, geometry])

  const getProjectId = acteur => {
    const filteredItems = filter(geometry.features, item => some(item.properties.acteurs, a => a && (normalize(a) === normalize(acteur))))
    const projectIds = filteredItems.map(m => m.properties._id)
    setMatchingIds(projectIds)
  }

  useEffect(() => {
    if (mapRef?.current.isStyleLoaded() && projetId) {
      if (selectedId.current && selectedId.current !== projetId) {
        mapRef.current.setFeatureState(
          {source: 'projetsData', id: selectedId.current},
          {hover: false}
        )
      }

      selectedId.current = projetId

      mapRef.current.setFeatureState(
        {source: 'projetsData', id: projetId},
        {hover: true}
      )
    }
  }, [projetId])

  return (
    <div style={{position: 'relative', height: '100%', width: '100%'}}>
      <div ref={mapNode} style={{width: '100%', height: '100%'}} />
      <Legend
        isMobile={isMobile === true}
        legend={layout}
      />

      <MapToolBox>
        <div className='fr-grid-row fr-grid-row--gutters fr-p-2w'>
          <div
            style={{
              backgroundColor: 'white'
            }}
          >
            <div className='fr-grid-row fr-grid-row--bottom'>
              <div className='fr-col-10'>

                <AutocompleteInput
                  label='Filtrer par acteurs'
                  value={acteurSearchInput}
                  description='Nom de l’acteur'
                  results={foundActeurs}
                  renderItem={item => item}
                  onInputChange={e => setActeurSearchInput(e.target.value)}
                  onSelectValue={item => {
                    setActeurSearchInput(item)
                    getProjectId(item)
                  }}
                />
              </div>
              <button
                type='button'
                className='fr-btn fr-icon-close-circle-line fr-col-2'
                onClick={() => {
                  setMatchingIds([])
                  setActeurSearchInput('')
                  setFoundActeurs([])
                }}
              />
            </div>
          </div>
          <div className='fr-p-1w fr-pt-3w'>
            <div>Colorisation de la carte par :</div>
            <div>
              <button
                type='button'
                className='fr-btn fr-btn--sm fr-m-1w'
                disabled={layout === 'projets-fills-nature'}
                onClick={() => setLayout('projets-fills-nature')}
              >
                nature
              </button>
              <button
                type='button'
                className='fr-btn fr-btn--sm fr-m-1w'
                disabled={layout === 'projets-fills'}
                onClick={() => setLayout('projets-fills')}
              >
                statut
              </button>
            </div>
          </div>
        </div>
      </MapToolBox>

      <button
        type='button'
        className='fr-btn fr-btn--icon-left fr-icon-add-circle-fill'
        style={{
          position: 'fixed',
          right: 10,
          bottom: `${isMobile ? '110px' : '45px'}`
        }}
        onClick={() => token ? router.push('/formulaire-suivi') : handleModal()}
      >
        Ajouter un projet
      </button>

      {isAuthentificationModalOpen && userRole !== 'admin' && <AuthentificationModal handleModalClose={handleModal} />}
    </div>
  )
}

Map.propTypes = {
  handleSelectProjet: PropTypes.func,
  isMobile: PropTypes.bool,
  geometry: PropTypes.object,
  projetId: PropTypes.string
}

export default Map
