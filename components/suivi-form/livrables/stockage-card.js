import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'
import {STOCKAGE_PARAMS} from '@/lib/utils/projet.js'

const StockageCard = ({type, params, generalSettings, handleDelete, handleEdition}) => {
  const url = type === 'http' ? params.url : `${params.host}${params.port ? `:${params.port}` : ''}${params.startPath || ''}`

  return (
    <div className='fr-grid-row card-container fr-grid-row--middle fr-grid-row--gutters fr-p-2w fr-col-12'>

      <div className='fr-grid-row fr-grid-row--middle fr-grid-row--gutters fr-col-lg-11'>
        {/* ---------------------- Top ---------------------- */}
        <div className='fr-grid-row fr-grid-row--gutters fr-col-12 infos-row'>
          <div className='fr-grid-row fr-col-12 fr-col-md-3'>
            <div className='label fr-col-12'>Type</div>
            <div className='fr-col-12 fr-text--sm fr-m-0'>{type}</div>
          </div>

          <div className='fr-grid-row fr-col-12 fr-col-md-3'>
            <div className='label fr-col-12'>URL</div>
            <div className='fr-col-12 fr-text--sm fr-m-0'>{url}</div>
          </div>

          <div className='fr-grid-row fr-col-12 fr-col-md-3'>
            <div className='label fr-col-12'>{STOCKAGE_PARAMS.username.label}</div>
            <div className='fr-col-12 fr-text--sm fr-m-0'>{params.username ? 'Enregistré' : 'N/A'}</div>
          </div>

          <div className='fr-grid-row fr-col-12 fr-col-md-3'>
            <div className='label fr-col-12'>{STOCKAGE_PARAMS.password.label}</div>
            <div className='fr-col-12 fr-text--sm fr-m-0'>{params.password ? 'Enregistré' : 'N/A'}</div>
          </div>
        </div>

        {/* ---------------------- Bottom ---------------------- */}
        <div className='fr-grid-row fr-grid-row--gutters fr-col-12 fr-mt-0 infos-row'>
          {type !== 'sftp' && (
            <div className='fr-grid-row fr-col-12 fr-col-md-3'>
              <div className='label fr-col-12'>Serveur sécurisé</div>
              <div className='fr-col-12 fr-text--sm fr-m-0'>
                <span className={`fr-icon-${params.secure ? 'checkbox-circle-fill' : 'close-circle-fill'} fr-pr-1w fr-col-lg-12`} aria-hidden='true' />
              </div>
            </div>
          )}

          <div className='fr-grid-row fr-col-12 fr-col-md-3'>
            <div className='label fr-col-12'>Information de connexion publique</div>
            <div className='fr-col-12 fr-text--sm fr-m-0'>
              <span className={`fr-icon-${generalSettings.isPublic ? 'checkbox-circle-fill' : 'close-circle-fill'} fr-pr-1w fr-col-lg-12`} aria-hidden='true' />
            </div>
          </div>

          <div className='fr-grid-row fr-col-12 fr-col-md-3'>
            <div className='label fr-col-12'>Téléchargement autorisé</div>
            <div className='fr-col-12 fr-text--sm fr-m-0'>
              <span className={`fr-icon-${generalSettings.isDownloadable ? 'checkbox-circle-fill' : 'close-circle-fill'} fr-pr-1w fr-col-lg-12`} aria-hidden='true' />
            </div>
          </div>
        </div>
      </div>

      <div className='fr-grid-row fr-grid-row--gutters fr-col-12 fr-col-lg-1 fr-p-0 buttons-container'>
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

      <style jsx>{`
        .card-container {
          background: ${colors.grey975};
          border-radius: 4px;
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

StockageCard.propTypes = {
  type: PropTypes.string.isRequired,
  params: PropTypes.shape({
    url: PropTypes.string,
    host: PropTypes.string,
    port: PropTypes.string,
    startPath: PropTypes.string,
    username: PropTypes.string,
    password: PropTypes.string,
    secure: PropTypes.bool
  }).isRequired,
  generalSettings: PropTypes.shape({
    isPublic: PropTypes.bool,
    isDownloadable: PropTypes.bool
  }),
  handleDelete: PropTypes.func.isRequired,
  handleEdition: PropTypes.func.isRequired
}

export default StockageCard
