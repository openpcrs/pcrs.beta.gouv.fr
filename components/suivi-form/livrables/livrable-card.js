import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

const LivrableCard = ({nom, nature, licence, diffusion, crs, avancement, publication, isFormOpen, handleEdition, handleDelete}) => (
  <div className={`fr-grid-row fr-p-2w fr-my-3w card-container ${isFormOpen ? 'card-disable' : ''}`}>
    <div className='fr-grid-row fr-col-12 fr-col-md-11'>
      <div className='fr-grid-row fr-col-lg-6'>
        <div className='fr-grid-row fr-col-12 fr-col-md-3 fr-p-1w fr-my-lg-2w'>
          <div className='label fr-col-12 fr-m-0'>Nom</div>
          <div className='fr-m-0 fr-grid-row fr-grid-row--top fr-col-12 fr-text--sm'>{nom}</div>
        </div>

        <div className='fr-grid-row fr-col-12 fr-col-md-3 fr-p-1w fr-my-lg-2w'>
          <div className='label fr-col-12 fr-m-0'>Publication</div>
          <div className='fr-m-0 fr-grid-row fr-grid-row--top fr-col-12 fr-text--sm'>{publication || 'N/A'}</div>
        </div>

        <div className='fr-grid-row fr-col-12 fr-col-md-3 fr-p-1w fr-my-lg-2w'>
          <div className='label fr-col-12 fr-m-0'>Nature</div>
          <div className='fr-m-0 fr-grid-row fr-grid-row--top fr-col-12 fr-text--sm'>{nature}</div>
        </div>

        <div className='fr-grid-row fr-col-12 fr-col-md-3 fr-p-1w fr-my-lg-2w'>
          <div className='label fr-col-12 fr-m-0'>Licence</div>
          <div className='fr-m-0 fr-grid-row fr-grid-row--top fr-col-12 fr-text--sm'>{licence}</div>
        </div>
      </div>

      <div className='fr-grid-row fr-col-lg-6'>
        <div className='fr-grid-row fr-col-12 fr-col-md-3 fr-col-lg-4 fr-p-1w fr-my-lg-2w'>
          <div className='label fr-col-12 fr-m-0'>Diffusion</div>
          <div className='fr-m-0 fr-grid-row fr-grid-row--top fr-col-12 fr-text--sm'>{diffusion || 'N/A'}</div>
        </div>

        <div className='fr-grid-row fr-col-12 fr-col-md-3 fr-col-lg-4 fr-p-1w fr-my-lg-2w'>
          <div className='label fr-col-12 fr-m-0'>Avancement (%)</div>
          <div className='fr-grid-row fr-grid-row--top fr-m-0 fr-col-12 fr-text--sm'>{avancement || 'N/A'}</div>
        </div>

        <div className='fr-grid-row fr-col-12 fr-col-md-3 fr-col-lg-4 fr-p-1w fr-my-lg-2w'>
          <div className='label fr-col-12 fr-m-0'>Système de référence spatial</div>
          <div className='fr-m-0 fr-col-12 fr-text--sm'>{crs || 'N/A'}</div>
        </div>
        <div className='fr-col-3 fr-col-lg-12' />
      </div>

    </div>

    <div className='fr-grid-row fr-col-12 fr-col-md-1 fr-mt-3w fr-mt-md-0 fr-grid-row--middle fr-grid-row--center'>
      <button
        type='button'
        className='fr-grid-row fr-col-md-12 fr-col-md-6 fr-my-1w fr-p-0 update-button'
        onClick={handleEdition}
      >
        <span className='fr-icon-edit-line fr-col-12' aria-hidden='true' />
        <div className='fr-col-12'>Modifier</div>
      </button>

      <button
        type='button'
        className='fr-grid-row fr-col-md-12 fr-col-md-6 fr-my-1w fr-p-0 delete-button'
        onClick={handleDelete}
      >
        <span className='fr-icon-delete-line fr-col-12' aria-hidden='true' />
        <div className='fr-col-12'>Supprimer</div>
      </button>
    </div>

    <style jsx>{`
      .card-container {
        background: ${colors.grey975};
        border-radius: 4px;
      }

      .card-disable {
        opacity: 30%;
        pointer-events: none;
      }

      .aplc-icon {
        color: ${colors.successMain525};
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

LivrableCard.propTypes = {
  nom: PropTypes.string.isRequired,
  nature: PropTypes.string.isRequired,
  licence: PropTypes.string.isRequired,
  diffusion: PropTypes.string,
  avancement: PropTypes.number,
  crs: PropTypes.string,
  isFormOpen: PropTypes.bool.isRequired,
  publication: PropTypes.string,
  handleDelete: PropTypes.func.isRequired,
  handleEdition: PropTypes.func.isRequired
}

LivrableCard.defaultProps = {
  publication: null,
  diffusion: null,
  avancement: null,
  crs: null
}

export default LivrableCard
