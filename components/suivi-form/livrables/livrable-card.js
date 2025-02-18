/* eslint-disable camelcase */
import PropTypes from 'prop-types'
import {useState, useEffect} from 'react'

import colors from '@/styles/colors.js'

import {shortDate} from '@/lib/date-utils.js'

import StockageRefresh from '@/components/suivi-form/livrables/stockage-refresh.js'

import {getNatures, getLicences, getDiffusions} from '@/components/suivi-form/livrables/utils/select-options.js'
import {getStockage} from '@/lib/pcrs-scanner-api.js'

const LivrableCard = ({livrable, isDisabled, handleEdition, handleDelete, handleRefreshScan}) => {
  const [error, setError] = useState()
  const [message, setMessage] = useState()
  const {nom, nature, licence, avancement, recouvr_lat, recouvr_lon, focale, cout, diffusion, diffusion_url, diffusion_layer, stockage, stockage_id, stockage_erreur} = livrable
  const dateLivraison = livrable.date_livraison

  useEffect(() => {
    async function getScannerInfos() {
      if (stockage_id) {
        const result = await getStockage(stockage_id)

        if (result.scan.status === 'processing') {
          setMessage('Scan en cours...')
        }

        if (result.scan.status === 'pending') {
          setMessage('Scan en attente...')
        }

        if (result.scan.lastError && result.scan.status === 'idle') {
          setError(result.scan.lastError)
        }
      }
    }

    getScannerInfos()
  }, [stockage_id])

  return (
    <div className={`fr-grid-row card-container fr-grid-row--middle fr-grid-row--gutters ${isDisabled ? 'card-disable' : ''} fr-p-2w fr-col-12`}>
      <div className='fr-grid-row fr-grid-row--middle fr-grid-row--center fr-grid-row--gutters fr-col-lg-10'>
        {/* ---------------------- Top ---------------------- */}
        <div className='fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-grid-row--middle fr-col-12 infos-row'>
          <div className='fr-grid-row fr-col-12 fr-col-md-3'>
            <div className='label fr-col-12'>Nom</div>
            <div className='fr-col-12 fr-text--sm fr-m-0'>{nom}</div>
          </div>

          <div className='fr-grid-row fr-col-12 fr-col-md-3'>
            <div className='label fr-col-12'>Nature</div>
            <div className='fr-col-12 fr-text--sm fr-m-0'>{getNatures(nature)}</div>
          </div>

          <div className='fr-grid-row fr-col-12 fr-col-md-3'>
            <div className='label fr-col-12'>Diffusion</div>
            <div className='fr-col-12 fr-text--sm fr-m-0'>{getDiffusions(diffusion) || 'N/A'}</div>
          </div>

          <div className='fr-grid-row fr-col-12 fr-col-md-3'>
            <div className='label fr-col-12'>Stockage</div>
            <div className='fr-col-12 fr-text--sm fr-m-0'>{stockage?.toUpperCase() || 'N/A'}</div>
          </div>
        </div>

        {/* ---------------------- Middle ---------------------- */}
        <div className='fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-grid-row--middle fr-col-12 infos-row'>
          <div className='fr-grid-row fr-col-12 fr-col-md-3'>
            <div className='label fr-col-12'>Licence</div>
            <div className='fr-col-12 fr-text--sm fr-m-0'>{getLicences(licence)}</div>
          </div>

          <div className='fr-grid-row fr-col-12 fr-col-md-3'>
            <div className='label fr-col-12'>Avancement</div>
            <div className='fr-col-12 fr-text--sm fr-m-0'>{avancement || 'N/A'}</div>
          </div>

          <div className='fr-grid-row fr-col-12 fr-col-md-3'>
            <div className='label fr-col-12'>Couche de diffusion</div>
            <div className='fr-col-12 fr-text--sm fr-m-0'>{diffusion_layer || 'N/A'}</div>
          </div>

          <div className='fr-grid-row fr-col-12 fr-col-md-3'>
            <div className='label fr-col-12'>Recouvrement</div>
            <div className='fr-col-12 fr-text--sm fr-m-0'><b>LAT</b> : {recouvr_lat || 'N/A'} / <b>LON</b> : {recouvr_lon || 'N/A'}</div>
          </div>
        </div>

        {/* ---------------------- Bottom ---------------------- */}
        <div className='fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-grid-row--middle fr-col-12 infos-row'>

          <div className='fr-grid-row fr-col-12 fr-col-md-3'>
            <div className='label fr-col-12'>Focale</div>
            <div className='fr-col-12 fr-text--sm fr-m-0'>{focale || 'N/A'}</div>
          </div>

          <div className='fr-grid-row fr-col-12 fr-col-md-3'>
            <div className='label fr-col-12'>Coût</div>
            <div className='fr-col-12 fr-text--sm fr-m-0'>{cout || 'N/A'}</div>
          </div>

          <div className='fr-grid-row fr-col-12 fr-col-md-3'>
            <div className='label fr-col-12'>URL de diffusion</div>
            <div className='fr-col-12 fr-text--sm fr-m-0'>{diffusion_url || 'N/A'}</div>
          </div>
          <div className='fr-grid-row fr-col-12 fr-col-md-3'>
            <div className='label fr-col-12'>Date de livraison</div>
            <div className='fr-col-12 fr-text--sm fr-m-0'>{dateLivraison ? shortDate(dateLivraison) : 'N/A'}</div>
          </div>
        </div>
      </div>

      {!isDisabled && (
        <div className='fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-col-12 fr-col-lg-2 fr-p-0 buttons-container'>
          <button
            type='button'
            className='fr-grid-row fr-col-lg-12 fr-grid-row--center fr-grid-row--middle fr-mr-2w update-button'
            onClick={handleEdition}
          >
            <span className='fr-icon-edit-line fr-pr-1w fr-col-lg-12' aria-hidden='true' />
            <div>Modifier</div>
          </button>

          <button
            type='button'
            className='fr-grid-row fr-col-lg-12 fr-grid-row--center fr-grid-row--middle delete-button'
            onClick={handleDelete}
          >
            <span className='fr-icon-delete-line fr-pr-1w fr-col-lg-12' aria-hidden='true' />
            <div>Supprimer</div>
          </button>
          <div className='fr-grid-row fr-col-lg-12 fr-grid-row--center fr-grid-row--middle'>
            {stockage_id && (
              <StockageRefresh
                handleRefreshScan={handleRefreshScan}
                stockageId={stockage_id}
              />
            )}
          </div>
          {stockage_erreur && (
            <span>Erreur : {stockage_erreur}</span>
          )}
          {error && (
            <span className='fr-error-text fr-col-lg-12 fr-grid-row fr-grid-row--center'>Erreur : {error}</span>
          )}
          {message && (
            <span className='fr-col-lg-12 fr-grid-row fr-grid-row--center'>{message}</span>
          )}
        </div>
      )}

      <style jsx>{`
        .card-container {
          background: ${colors.grey975};
          border-radius: 4px;
        }

        .card-disable {
          opacity: 30%;
          pointer-events: none;
        }

        .infos-row, .buttons-container {
          height: fit-content;
        }

        .label {
          font-weight: bold;
          color: ${colors.blueFranceSun113};
        }

        .update-button, .delete-button {
          text-decoration: underline;
          width: fit-content;
        }

        .update-button {
          color: ${colors.blueFranceSun113};
        }

        .delete-button {
          color: ${colors.error425};
        }
      `}</style>
    </div>
  )
}

LivrableCard.propTypes = {
  livrable: PropTypes.shape({
    nom: PropTypes.string.isRequired,
    nature: PropTypes.string.isRequired,
    licence: PropTypes.string.isRequired,
    diffusion: PropTypes.string,
    avancement: PropTypes.number,
    recouvr_lat: PropTypes.number,
    recouvr_lon: PropTypes.number,
    focale: PropTypes.number,
    cout: PropTypes.number,
    diffusion_url: PropTypes.string,
    diffusion_layer: PropTypes.string,
    stockage: PropTypes.oneOf(['http', 'ftp', 'sftp']),
    stockage_params: PropTypes.object,
    stockage_id: PropTypes.string,
    stockage_erreur: PropTypes.string,
    date_livraison: PropTypes.string
  }).isRequired,
  isDisabled: PropTypes.bool.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleEdition: PropTypes.func.isRequired,
  handleRefreshScan: PropTypes.func
}

export default LivrableCard
