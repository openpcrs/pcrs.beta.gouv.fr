import {useEffect, useState} from 'react'
import PropTypes from 'prop-types'

import {scanRenderItem} from './list-render-items.js'
import {dateWithTime} from '@/lib/date-utils.js'
import {getStockageGeoJSON} from '@/lib/pcrs-scanner-api.js'

import colors from '@/styles/colors.js'

import CenteredSpinnder from '@/components/centered-spinner.js'
import ScannerMap from '@/components/projet/scanner-map.js'

const ScannedData = ({data, downloadToken, geojson, stockageId, handleStorage, handleErrorMessages, errorMessages}) => {
  const {lastError, result} = data
  const [isLoading, setIsLoading] = useState(true)

  const sanitizedScanTime = dateWithTime(result.lastSuccessfulScan)

  useEffect(() => {
    handleErrorMessages(prevErrors => ({...prevErrors, geojsonFetchError: null}))

    async function fetchGeojson() {
      try {
        const geojson = await getStockageGeoJSON(stockageId)

        handleStorage(prevStockage => ({...prevStockage, geojson}))
      } catch {
        handleErrorMessages(prevErrors => ({...prevErrors, geojsonFetchError: 'Les ressources du livrable sont indisponibles'}))
      }

      setIsLoading(false)
    }

    fetchGeojson()
  }, [stockageId]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='fr-mt-6w'>
      <div className='fr-grid-row fr-grid-row--middle'>
        <span className='fr-icon-settings-5-fill fr-mr-1w' aria-hidden='true' />
        <h3 className='section-title fr-text--md fr-m-0'>Scan</h3>
      </div>
      <div>
        {!errorMessages.dataFetchError && (
          <>
            <div>{lastError ? (
              <p className='fr-error-text'>Échec du scan. Les données affichées datent du scan du {sanitizedScanTime}</p>
            ) : (
              <p className='fr-valid-text fr-mt-1w fr-col-12'>Dernier scan accompli avec succès le {sanitizedScanTime}</p>
            )}
            </div>

            {/* scan livrable data */}
            <div>{scanRenderItem(result.raster)}</div>

            <div>
              {result && (
                <p className='fr-mb-1w'>
                  <span className='files-total'>{result.dataFiles}</span> fichier{result.dataFiles > 1 && 's'}  de données scannées
                  {result.brokenDataFiles > 1 && (
                    <span>dont <span className='error-total'> {result.brokenDataFiles} fichier{result.brokenDataFiles > 1 && 's'} en erreur</span></span>
                  )}.
                </p>
              )}
            </div>
          </>
        )}

        {isLoading ? (
          <div className='spinner-container fr-col-12 fr-grid-row fr-grid-row--center fr-grid-row--middle'>
            <div className='fr-col-12'>
              <CenteredSpinnder />
            </div>
          </div>
        ) : (
          <div>
            {errorMessages.geojsonFetchError ? (
              <p id='text-input-error-desc-error' className='fr-error-text'>{errorMessages.geojsonFetchError}</p>
            ) : (
              <div className='map-wrapper'>
                <ScannerMap geojson={geojson} downloadToken={downloadToken} />
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

        .files-total, .error-total{
          font-weight: bold;
        }

        .error-total {
          color: ${colors.error425};
        }
      `}</style>
    </div>
  )
}

ScannedData.propTypes = {
  data: PropTypes.object,
  geojson: PropTypes.object,
  downloadToken: PropTypes.string,
  errorMessages: PropTypes.object.isRequired,
  stockageId: PropTypes.string.isRequired,
  handleStorage: PropTypes.func.isRequired,
  handleErrorMessages: PropTypes.func.isRequired
}

ScannedData.defaultProps = {
  data: null,
  geojson: null
}

export default ScannedData
