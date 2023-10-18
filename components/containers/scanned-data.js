import PropTypes from 'prop-types'

import {dateWithTime} from '@/lib/date-utils.js'
import {formatBytes} from '@/lib/utils/file.js'
import {BANDES} from '@/lib/utils/projet.js'

import colors from '@/styles/colors.js'

import ScannerMap from '@/components/containers/scanner-map.js'
import Badge from '@/components/badge.js'

const NATURE_LABELS = {
  geotiff: 'GeoTIFF',
  jpeg2000: 'Jpeg 2000',
  gml: 'GML vecteur'
}

const ScannedData = ({data, geojson}) => {
  const {lastError, result} = data
  const {raster} = result || null

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

        <div className='fr-col-12 params-wrapper fr-my-3w'>
          <div className='fr-mt-1w fr-grid-row'><div className='data-title fr-mr-1w'>Nature :</div><Badge size='small' background='#fc916f'>PCRS raster</Badge></div>
          <div className='fr-grid-row'><div className='data-title fr-mr-1w'>Format :</div><span>{NATURE_LABELS[raster?.format] || 'Non renseigné'}</span></div>
          <div className='fr-mt-1w fr-grid-row'><div className='data-title fr-mr-1w'>Nombre de dalles :</div><span>{raster?.dalles || 'Non renseigné'}</span></div>
          <div className='fr-mt-1w fr-grid-row'><div className='data-title fr-mr-1w'>Projection :</div><span>{raster?.projection || 'Non renseigné'}</span></div>
          <div className='fr-mt-1w fr-grid-row'><div className='data-title fr-mr-1w'>Poids :</div><span>{raster?.size ? formatBytes(raster.size) : 'Non renseigné'}</span></div>
          <div className='fr-mt-1w fr-grid-row'>
            <div className='data-title fr-mr-1w'>Bandes :</div>
            {raster?.bandes ? (
              raster.bandes.map(bande => (
                <Badge
                  key={bande}
                  size='small'
                  background={BANDES[bande].color}
                  textColor={BANDES[bande].textColor}
                >
                  {BANDES[bande].label}
                </Badge>
              ))
            ) : (
              'Non renseigné'
            )}
          </div>
        </div>

        <div>
          <p className='fr-mb-1w'>
            <span className='files-total'>{result.dataFiles}</span> fichier{result.dataFiles > 1 && 's'}  de données dont <span className='error-total'> {result.brokenDataFiles} fichier{result.brokenDataFiles > 1 && 's'} en erreur</span>.
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
