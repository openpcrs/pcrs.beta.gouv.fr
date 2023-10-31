/* eslint-disable camelcase */
import {useState} from 'react'
import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

import {shortDate} from '@/lib/date-utils.js'
import {refreshScan} from '@/lib/suivi-pcrs.js'

import {getNatures, getLicences, getDiffusions} from '@/components/suivi-form/livrables/utils/select-options.js'

const LivrableCard = ({livrable, isDisabled, handleEdition, handleDelete, projetId, editCode}) => {
  const [refreshedScan, setRefreshedScan] = useState(false)
  const {nom, nature, licence, avancement, diffusion, stockage, stockage_id} = livrable
  const dateLivraison = livrable.date_livraison

  async function handleRefreshScan() {
    try {
      const response = await refreshScan(projetId, stockage_id, editCode)
      if (response) {
        setRefreshedScan(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

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
            {stockage && (
              <button
                type='button'
                disabled={refreshedScan}
                className='fr-btn fr-btn--sm fr-btn--secondary fr-btn--icon-left fr-icon-refresh-line'
                onClick={() => handleRefreshScan()}
              >
                {refreshedScan ? 'Scan relancé' : 'Relancer le scan'}
              </button>
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
    stockage_id: PropTypes.string,
    date_livraison: PropTypes.string
  }).isRequired,
  projetId: PropTypes.string,
  editCode: PropTypes.string,
  isDisabled: PropTypes.bool.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleEdition: PropTypes.func.isRequired
}

export default LivrableCard
