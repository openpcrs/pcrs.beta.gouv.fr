import PropTypes from 'prop-types'

import {dateWithTime} from '@/lib/date-utils.js'
import {formatBytes} from '@/lib/utils/file.js'
import {LIVRABLE_NATURES} from '@/lib/utils/projet.js'

import colors from '@/styles/colors.js'

import ScannerMap from '@/components/containers/scanner-map.js'
import Badge from '@/components/badge.js'

const BANDES_COLORS = {
  Red: {color: '#c9191e', textColor: '#fff'},
  Blue: {color: '#0063cb', textColor: '#fff'},
  Green: {color: '#18753C', textColor: '#fff'},
  Alpha: {color: '#304B5B', textColor: '#fff'}
}

const ScannedData = ({data, geojson}) => {
  const {lastError, result} = data

  const sanitizedScanTime = dateWithTime(result?.lastSuccessfulScan)

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

        <div className='fr-col-12 params-wrapper fr-my-3w'>
          <div className='fr-mt-1w fr-grid-row'><div className='data-title fr-mr-1w'>Nature :</div><Badge size='small' background='#fc916f'>PCRS raster</Badge></div>
          <div className='fr-grid-row'><div className='data-title fr-mr-1w'>Format :</div>
            <span>
              {result?.raster?.format
                ? LIVRABLE_NATURES[result.raster.format].label
                : 'Non renseigné'}
            </span>
          </div>
          <div className='fr-mt-1w fr-grid-row'><div className='data-title fr-mr-1w'>Nombre de dalles :</div><span>{result?.raster?.numRasterFiles || 'Non renseigné'}</span></div>
          <div className='fr-mt-1w fr-grid-row'><div className='data-title fr-mr-1w'>Projection :</div><span>{result?.raster?.projection || 'Non renseigné'}</span></div>
          <div className='fr-mt-1w fr-grid-row'><div className='data-title fr-mr-1w'>Poids :</div><span>{result?.raster?.sizeRasterFiles ? formatBytes(result.raster.sizeRasterFiles) : 'Non renseigné'}</span></div>
          <div className='fr-mt-1w fr-grid-row'>
            <div className='data-title fr-mr-1w'>Bandes :</div>
            {result?.raster?.bands.length > 0 ? (
              result?.raster.bands.map(band => (
                <Badge
                  key={band.id}
                  size='small'
                  background={BANDES_COLORS[band.colorInterpretation].color}
                  textColor={BANDES_COLORS[band.colorInterpretation].textColor}
                >
                  {band.dataType}
                </Badge>
              ))
            ) : (
              'Non renseigné'
            )}
          </div>
        </div>

        <div>
          <p className='fr-mb-1w'>
            <span className='files-total'>{result?.dataFiles}</span> fichier{result?.dataFiles > 1 && 's'}  de données scannées
            {result?.brokenDataFiles > 1 && (
              <span>dont <span className='error-total'> {result?.brokenDataFiles} fichier{result?.brokenDataFiles > 1 && 's'} en erreur</span></span>
            )}.
          </p>
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
