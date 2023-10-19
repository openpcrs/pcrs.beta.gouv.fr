import PropTypes from 'prop-types'

import {scanRenderItem} from './list-render-items.js'
import {dateWithTime} from '@/lib/date-utils.js'

import colors from '@/styles/colors.js'

import ScannerMap from '@/components/projet/scanner-map.js'

const ScannedData = ({data, geojson}) => {
  const {lastError, result} = data

  const sanitizedScanTime = dateWithTime(result.lastSuccessfulScan)

  return (
    <div className='fr-mt-3w'>
      <div className='fr-grid-row fr-grid-row--middle'>
        <span className='fr-icon-database-line fr-mr-1w' aria-hidden='true' />
        <h3 className='section-title fr-text--lead fr-m-0'>Scan</h3>
      </div>
      <div>
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
          <div className='map-wrapper'>
            <ScannerMap geojson={geojson} />
          </div>
        </div>
      </div>
      <style jsx>{`
        .map-wrapper {
          width: 100%;
          height: 500px;
        }

        .section-title {
         border-bottom: 4px solid ${colors.info425};
       }

        .data-title {
          color: ${colors.info425};
          font-weight: bold;
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
  data: PropTypes.object.isRequired,
  geojson: PropTypes.object.isRequired
}

export default ScannedData
