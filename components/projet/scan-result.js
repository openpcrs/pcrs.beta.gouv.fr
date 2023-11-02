import PropTypes from 'prop-types'
import {scanRenderItem} from './list-render-items.js'

import colors from '@/styles/colors.js'
import {dateWithTime} from '@/lib/date-utils.js'

const ScanResult = ({raster, lastSuccessfulScan, dataFiles, brokenDataFiles, lastError}) => {
  const sanitizedScanTime = dateWithTime(lastSuccessfulScan)

  return (
    <div>
      <div>
        {lastError ? (
          <div className='fr-error-text'>Échec du scan. Les données affichées datent du scan du {sanitizedScanTime} : <i>{lastError}</i></div>
        ) : (
          <div className='fr-valid-text fr-mt-1w fr-col-12'>Dernier scan accompli avec succès le {sanitizedScanTime}</div>
        )}
      </div>

      <div>{scanRenderItem(raster)}</div>

      <div>
        <p className='fr-mb-1w'>
          <span className='files-total'>{dataFiles}</span> fichier{dataFiles > 1 && 's'}  de données scannées
          {brokenDataFiles > 1 && (
            <span> dont <span className='error-total'> {brokenDataFiles} fichier{brokenDataFiles > 1 && 's'} en erreur</span></span>
          )}.
        </p>
      </div>

      <style jsx>{`
        .files-total, .error-total {
          font-weight: bold;
        }

        .error-total {
          color: ${colors.error425};
        }
    `}</style>
    </div>
  )
}

ScanResult.propTypes = {
  raster: PropTypes.object.isRequired,
  lastSuccessfulScan: PropTypes.string,
  dataFiles: PropTypes.number.isRequired,
  brokenDataFiles: PropTypes.number.isRequired,
  lastError: PropTypes.string
}

export default ScanResult
