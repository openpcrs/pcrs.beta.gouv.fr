import {useEffect, useRef, useState} from 'react'
import PropTypes from 'prop-types'
import maplibreGl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

import vector from './styles/vector.json'

const Map = ({isMobile}) => {
  const [map, setMap] = useState()
  const mapNode = useRef(null)

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

  return (
    <div style={{position: 'relative', height: '100%', width: '100%'}}>
      <div ref={mapNode} style={{width: '100%', height: '100%'}} />
    </div>
  )
}

Map.propTypes = {
  isMobile: PropTypes.bool
}

export default Map

