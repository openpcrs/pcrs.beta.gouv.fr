import {useEffect, useRef, useContext} from 'react'
import PropTypes from 'prop-types'

import maplibreGl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

import vector from '../map/styles/vector.json'

import DeviceContext from '@/contexts/device.js'
import {formatBytes} from '@/lib/utils/file.js'

const ScannerMap = ({geojson, downloadToken}) => {
  const {isMobile} = useContext(DeviceContext)

  const mapNode = useRef()
  const mapRef = useRef()

  useEffect(() => {
    const node = mapNode.current
    const map = new maplibreGl.Map({
      container: node,
      style: vector,
      center: [1.7, 46.9],
      zoom: isMobile ? 4 : 5,
      attributionControl: false,
      maxZoom: 15,
      minZoom: 4
    })

    mapRef.current = map

    const resizer = new ResizeObserver(() => map.resize())
    resizer.observe(node)

    map.addControl(new maplibreGl.NavigationControl())
    map.addControl(new maplibreGl.AttributionControl({compact: true}), 'bottom-right')

    const popup = new maplibreGl.Popup({
      offset: 15,
      closeButton: false,
      closeOnClick: false
    })

    map.on('mousemove', e => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['stockage-layer']
      })

      if (features.length === 0) {
        popup.remove()
        return
      }

      const [feature] = features

      popup.setLngLat(e.lngLat)
        .setHTML(`
         <div>
           <div style="font-size: 1.1em; font-weight: bold;">${feature.properties.name}</div>
           <div>
             <div>Format : <b>${feature.properties.format}</b></div>
             <div>Poids : <b>${formatBytes(feature.properties.size)}</b></div>
             ${downloadToken ? '<div class="fr-alert fr-alert--info fr-alert--sm fr-mt-1w"><p>Cliquer pour télécharger les données</p></div>' : ''}
           </div>
         </div>
      `)
        .addTo(map)
    })

    if (downloadToken) {
      map.on('click', 'stockage-layer', e => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['stockage-layer']
        })

        if (features.length > 0) {
          const [feature] = features
          const {downloadUrl} = feature.properties

          if (downloadUrl) {
            window.open(`${downloadUrl}?token=${downloadToken}`, '_blank')
          }
        }
      })
    }

    map.on('load', () => {
      map.addSource('stockage', {
        type: 'geojson',
        data: geojson
      })

      map.addLayer({
        id: 'stockage-layer',
        type: 'fill',
        source: 'stockage',
        paint: {
          'fill-opacity': 0.2
        }
      })

      const bounds = new maplibreGl.LngLatBounds()

      geojson.features.forEach(feature => {
        feature.geometry.coordinates[0].forEach(coord => {
          bounds.extend(coord)
        })
      })

      map.fitBounds(bounds, {
        padding: 20,
        duration: 0
      })
    })

    return () => {
      resizer.disconnect()
      map.remove()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{position: 'relative', height: '100%', width: '100%'}}>
      <div ref={mapNode} style={{width: '100%', height: '100%'}} />
    </div>
  )
}

ScannerMap.propTypes = {
  geojson: PropTypes.shape({
    features: PropTypes.array.isRequired
  }).isRequired,
  downloadToken: PropTypes.string
}

export default ScannerMap
