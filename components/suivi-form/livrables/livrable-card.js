/* eslint-disable camelcase */
import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

import {shortDate} from '@/lib/date-utils.js'

import StockageRefresh from '@/components/suivi-form/livrables/stockage-refresh.js'

import {getNatures, getLicences, getDiffusions} from '@/components/suivi-form/livrables/utils/select-options.js'

const LivrableCard = ({livrable, isDisabled, handleEdition, handleDelete, handleRefreshScan}) => {
  const {nom, nature, licence, avancement, diffusion, stockage, stockage_id} = livrable
  const dateLivraison = livrable.date_livraison

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

        {/* ---------------------- Bottom ---------------------- */}
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
            <div className='label fr-col-12'>Date de livraison</div>
            <div className='fr-col-12 fr-text--sm fr-m-0'>{dateLivraison ? shortDate(dateLivraison) : 'N/A'}</div>

          </div>

          <div className='fr-grid-row fr-col-12 fr-col-md-3'>
            {stockage && !livrable?.stockage_params?.url_externe && (
              <StockageRefresh
                handleRefreshScan={handleRefreshScan}
                stockageId={stockage_id}
              />
            )}
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
    stockage: PropTypes.oneOf(['http', 'ftp', 'sftp']),
    stockage_params: PropTypes.object,
    stockage_id: PropTypes.string,
    date_livraison: PropTypes.string
  }).isRequired,
  isDisabled: PropTypes.bool.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleEdition: PropTypes.func.isRequired,
  handleRefreshScan: PropTypes.func
}

export default LivrableCard
