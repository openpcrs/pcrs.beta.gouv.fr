import {useCallback, useEffect, useRef, useState} from 'react'
import PropTypes from 'prop-types'
import maplibreGl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import projets from '../../fakeprojets.json'
import departementData from './sources/departements.json'
import departementFillLayer from './layers/departement-fill.json'
import departementLayer from './layers/departement-layer.json'

import vector from './styles/vector.json'

const getPCRSFeatures = projects => {
  const featurePcrs = []

  projects.forEach(p => {
    const territoires = new Set(p.perimetre.territoires.map(t => (
      t.codeDepartement
    )))

    const pcrs = {
      id: p.id,
      perimetre: territoires,
      statut: p.statut
    }

    featurePcrs.push(pcrs)
  })

  return featurePcrs
}

function loadLayer({map, data, layer, sourceName}) {
  if (!map.getSource(sourceName)) {
    map.addSource(sourceName, {
      type: 'geojson',
      data,
      generateId: true
    })
  }

  if (!map.getLayer(layer.id)) {
    map.addLayer(layer)
  }
}

const Map = ({handleClick, isMobile}) => {
  const [map, setMap] = useState()
  const mapNode = useRef(null)
  const pcrsFeatures = getPCRSFeatures(projets)

  const popupRef = useRef(new maplibreGl.Popup({
    offset: 50,
    maxWidth: 'none',
    closeButton: false,
    closeOnClick: false
  }))

  const getFeatures = useCallback(() => {
    const features = []

    departementData.features.forEach(f => {
      pcrsFeatures.forEach(t => {
        if (t.perimetre.has(f.properties.code)) {
          features.push(f)
          f.properties.pcrsId = t.id
          f.properties.pcrsStatus = t.statut
        }
      })
    })

    return {
      type: 'FeatureCollection',
      features
    }
  }, [pcrsFeatures])

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
      console.log('set map')

      return () => {
        resizer.disconnect()
        maplibreMap.remove()
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let hoveredCode = null
    let selectedCodes = null
    const features = getFeatures()

    if (map) {
      map.on('styledata', () => {
        loadLayer({
          map,
          data: features,
          layer: departementFillLayer,
          sourceName: 'departements'
        })
      })

      map.on('styledata', () => {
        loadLayer({
          map,
          data: features,
          layer: departementLayer,
          sourceName: 'contours-departements'
        })
      })

      map.on('click', 'departements-fills', e => {
        handleClick(e)
      })

      map.on('click', 'departements-fills', e => {
        if (e.features.length > 0) {
          if (selectedCodes !== null) {
            map.setFeatureState(
              {source: 'departements', id: selectedCodes},
              {hover: false}
            )
          }

          selectedCodes = e.features[0].id

          map.setFeatureState(
            {source: 'departements', id: selectedCodes},
            {hover: true}
          )
        }
      })

      map.on('mouseleave', 'departements-fills', () => {
        if (hoveredCode !== null) {
          map.setFeatureState(
            {source: 'departements', id: hoveredCode}
          )

          popupRef.current.remove()
        }

        hoveredCode = null
      })
    }
  }, [map, getFeatures, handleClick, isMobile])

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

