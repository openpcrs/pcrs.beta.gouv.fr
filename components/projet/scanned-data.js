import {useEffect, useState} from 'react'
import PropTypes from 'prop-types'

import ScanResult from './scan-result.js'
import {getStockageGeoJSON} from '@/lib/pcrs-scanner-api.js'

import CenteredSpinner from '@/components/centered-spinner.js'
import ScannerMap from '@/components/projet/scanner-map.js'

const ScannedData = ({data, stockageId}) => {
  const [geojson, setGeojson] = useState()
  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setError(null)

    async function fetchGeojson() {
      try {
        const geojson = await getStockageGeoJSON(stockageId)

        setGeojson(geojson)
      } catch {
        setError('Impossible de récupérer les ressources cartographique du livrable')
      }

      setIsLoading(false)
    }

    fetchGeojson()
  }, [stockageId])

  return (
    <div className='fr-mt-6w'>
      <div className='fr-grid-row fr-grid-row--middle'>
        <span className='fr-icon-settings-5-fill fr-mr-1w' aria-hidden='true' />
        <h3 className='section-title fr-text--md fr-m-0'>Scan</h3>
      </div>
      <div>
        {/* scan livrable data */}
        {data.result && <ScanResult {...data.result} lastError={data.lastError} />}
        {!data.result && data.lastError}

        {isLoading ? (
          <div className='spinner-container fr-col-12 fr-grid-row fr-grid-row--center fr-grid-row--middle'>
            <div className='fr-col-12'>
              <CenteredSpinner />
            </div>
          </div>
        ) : (
          <div>
            {error ? (
              <div id='text-input-error-desc-error' className='fr-error-text'>{error}</div>
            ) : (
              <div className='map-wrapper'>
                <ScannerMap geojson={geojson} />
              </div>
            )}

          </div>
        )}

      </div>
      <style jsx>{`
        .map-wrapper {
          width: 100%;
          height: 500px;
        }
      `}</style>
    </div>
  )
}

ScannedData.propTypes = {
  data: PropTypes.object,
  stockageId: PropTypes.string.isRequired
}

ScannedData.defaultProps = {
  data: null
}

export default ScannedData
