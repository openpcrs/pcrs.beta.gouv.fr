import {createRoot} from 'react-dom/client' // eslint-disable-line n/file-extension-in-import
import {useEffect, useRef, useState} from 'react'
import PropTypes from 'prop-types'
import maplibreGl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import departementFillLayer from './layers/departement-fill.json'
import departementLayer from './layers/departement-layer.json'

import vector from './styles/vector.json'

import Popup from '@/components/map/popup.js'
import Loader from '@/components/loader.js'

const Map = ({handleClick, isMobile}) => {
  const [map, setMap] = useState()
  const mapNode = useRef(null)

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

    if (!map) {
      const maplibreMap = new maplibreGl.Map({
        container: node,
        style: vector,
        center: [1.7, 46.9],
        zoom: isMobile ? 4 : 5,
        attributionControl: false
      })

      const resizer = new ResizeObserver(() => maplibreMap.resize())
      resizer.observe(node)

      maplibreMap.addControl(new maplibreGl.NavigationControl())
      maplibreMap.addControl(new maplibreGl.AttributionControl({compact: true}), 'bottom-right')

      setMap(maplibreMap)

      return () => {
        resizer.disconnect()
        maplibreMap.remove()
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (map) {
      map.addSource('projetsData', {
        type: 'geojson',
        data: '/projets.geojson',
        generateId: true
      })

      map.addLayer(departementFillLayer)
      map.addLayer(departementLayer)
    }
  }, [map])

  useEffect(() => {
    let hoveredCode = null
    let selectedCode = null
    let projet = null

    if (map) {
      map.on('click', 'departements-fills', e => {
        handleClick(e)
      })

      if (!isMobile) {
        map.on('mousemove', 'departements-fills', e => {
          if (e.features.length > 0) {
            if (hoveredCode) {
              map.setFeatureState(
                {source: 'projetsData', id: null}
              )
            }

            hoveredCode = e.features[0].id

            projet = e.features[0].properties

            popupRoot.render(
              <Popup
                project={projet}
              />
            )

            popupRef.current
              .setLngLat(e.lngLat)
              .setDOMContent(popupNode)
              .addTo(map)

            map.setFeatureState(
              {source: 'projetsData', id: hoveredCode}
            )
          }
        })
      }

      map.on('click', 'departements-fills', e => {
        if (e.features.length > 0) {
          if (selectedCode) {
            map.setFeatureState(
              {source: 'projetsData', id: selectedCode},
              {hover: false}
            )
          }

          selectedCode = e.features[0].id

          map.setFeatureState(
            {source: 'projetsData', id: selectedCode},
            {hover: true}
          )
        }
      })

      map.on('mouseleave', 'departements-fills', () => {
        if (hoveredCode !== null) {
          map.setFeatureState(
            {source: 'projetsData', id: hoveredCode}
          )

          popupRoot.render(<Loader size='small' />)
          popupRef.current.remove()
        }

        hoveredCode = null
      })
    }
  }, [map, popupNode, popupRoot, handleClick, isMobile])

  return (
    <div style={{position: 'relative', height: '100%', width: '100%'}}>
      <div ref={mapNode} style={{width: '100%', height: '100%'}} />
    </div>
  )
}

Map.propTypes = {
  handleClick: PropTypes.func,
  isMobile: PropTypes.bool
}

export default Map

