import {createRoot} from 'react-dom/client' // eslint-disable-line n/file-extension-in-import
import {useEffect, useRef, useState, useContext} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'

import maplibreGl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

import departementFillLayer from './layers/departement-fill.json'
import departementFillNature from './layers/departement-fill-nature.json'
import departementLayer from './layers/departement-layer.json'
import vector from './styles/vector.json'

import AuthentificationContext from '@/contexts/authentification-token.js'

import Popup from '@/components/map/popup.js'
import Loader from '@/components/loader.js'
import Legend from '@/components/map/legend.js'
import AuthentificationModal from '@/components/suivi-form/authentification/authentification-modal.js'

const Map = ({handleClick, isMobile, geometry, projetId}) => {
  const {userRole, token} = useContext(AuthentificationContext)
  const router = useRouter()
  const [layout, setLayout] = useState('departements-fills')

  const [isAuthentificationModalOpen, setIsAuthentificationModalOpen] = useState(false)

  const handleModal = () => setIsAuthentificationModalOpen(!isAuthentificationModalOpen)

  const mapNode = useRef()
  const mapRef = useRef()
  const selectedCode = useRef()

  const popupRef = useRef(new maplibreGl.Popup({
    offset: 50,
    maxWidth: 'none',
    closeButton: false,
    closeOnClick: false
  }))
  const popupNode = document.createElement('div')
  const popupRoot = createRoot(popupNode)

  useEffect(() => {
    const node = mapNode.current
    let hoveredCode = null
    let projet = null

    const maplibreMap = new maplibreGl.Map({
      container: node,
      style: vector,
      center: [1.7, 46.9],
      zoom: isMobile ? 4 : 5,
      attributionControl: false
    })

    mapRef.current = maplibreMap

    const resizer = new ResizeObserver(() => maplibreMap.resize())
    resizer.observe(node)

    maplibreMap.addControl(new maplibreGl.NavigationControl())
    maplibreMap.addControl(new maplibreGl.AttributionControl({compact: true}), 'bottom-right')

    maplibreMap.on('click', 'departements-fills', e => {
      handleClick(e)
    })
    maplibreMap.on('click', 'departements-fills-nature', e => {
      handleClick(e)
    })

    if (!isMobile) {
      maplibreMap.on('mousemove', 'departements-fills', e => {
        if (e.features.length > 0) {
          if (hoveredCode) {
            maplibreMap.setFeatureState(
              {source: 'projetsData', id: null}
            )
          }

          hoveredCode = e.features[0].id

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
            .addTo(maplibreMap)

          maplibreMap.setFeatureState(
            {source: 'projetsData', id: hoveredCode}
          )
        }
      })
    }

    maplibreMap.on('mouseleave', 'departements-fills', () => {
      if (hoveredCode !== null) {
        maplibreMap.setFeatureState(
          {source: 'projetsData', id: hoveredCode}
        )

        popupRoot.render(<Loader size='small' />)
      }

      popupRef.current.remove()
      hoveredCode = null
    })

    maplibreMap.on('load', () => {
      maplibreMap.addSource('projetsData', {
        type: 'geojson',
        data: geometry,
        promoteId: '_id'
      })

      if (projetId) {
        maplibreMap.setFeatureState(
          {source: 'projetsData', id: projetId},
          {hover: true}
        )
      }

      maplibreMap.addLayer(departementFillLayer)
      maplibreMap.addLayer(departementFillNature)
      maplibreMap.addLayer(departementLayer)
    })

    return () => {
      resizer.disconnect()
      maplibreMap.remove()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (mapRef?.current?.isStyleLoaded()) {
      if (layout === 'departements-fills-nature') {
        mapRef.current.setLayoutProperty('departements-fills-nature', 'visibility', 'visible')
        mapRef.current.setLayoutProperty('departements-fills', 'visibility', 'none')
      }

      if (layout === 'departements-fills') {
        mapRef.current.setLayoutProperty('departements-fills', 'visibility', 'visible')
        mapRef.current.setLayoutProperty('departements-fills-nature', 'visibility', 'none')
      }
    }
  }, [layout])
    if (mapRef?.current.isStyleLoaded() && projetId) {
      if (selectedCode?.current && selectedCode?.current !== projetId) {
        mapRef.current.setFeatureState(
          {source: 'projetsData', id: selectedCode.current},
          {hover: false}
        )
      }

      selectedCode.current = projetId

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
      <button
        type='button'
        className='fr-btn fr-btn--sm'
        style={{
          position: 'fixed',
          right: 10,
          bottom: '100px'
        }}
        onClick={() => setLayout(layout === 'departements-fills-nature' ? 'departements-fills' : 'departements-fills-nature')}
      >
        Afficher par {layout === 'departements-fills' ? 'nature' : 'statut'}
      </button>

      {isAuthentificationModalOpen && userRole !== 'admin' && <AuthentificationModal handleModalClose={handleModal} />}
    </div>
  )
}

Map.propTypes = {
  handleClick: PropTypes.func,
  isMobile: PropTypes.bool,
  geometry: PropTypes.object,
  projetId: PropTypes.string
}

export default Map
