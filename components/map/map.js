import {createRoot} from 'react-dom/client' // eslint-disable-line n/file-extension-in-import
import {useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import maplibreGl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import departementFillLayer from './layers/departement-fill.json'
import departementLayer from './layers/departement-layer.json'

import vector from './styles/vector.json'

import Popup from '@/components/map/popup.js'
import Loader from '@/components/loader.js'
import Legend from '@/components/map/legend.js'

const Map = ({handleClick, isMobile}) => {
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
    let hoveredCode = null
    let selectedCode = null
    let projet = null

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

    maplibreMap.on('click', 'departements-fills', e => {
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
              projet={projet}
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

    maplibreMap.on('click', 'departements-fills', e => {
      if (e.features.length > 0) {
        if (selectedCode !== null) {
          maplibreMap.setFeatureState(
            {source: 'projetsData', id: selectedCode},
            {hover: false}
          )
        }

        selectedCode = e.features[0].id

        maplibreMap.setFeatureState(
          {source: 'projetsData', id: selectedCode},
          {hover: true}
        )
      }
    })

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
        data: '/projets.geojson',
        generateId: true
      })

      maplibreMap.addLayer(departementFillLayer)
      maplibreMap.addLayer(departementLayer)
    })

    return () => {
      resizer.disconnect()
      maplibreMap.remove()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{position: 'relative', height: '100%', width: '100%'}}>
      <div ref={mapNode} style={{width: '100%', height: '100%'}} />
      <Legend isMobile={isMobile === true} />
    </div>
  )
}

Map.propTypes = {
  handleClick: PropTypes.func,
  isMobile: PropTypes.bool
}

export default Map

