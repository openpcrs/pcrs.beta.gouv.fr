import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

const LivrableCard = ({nom, nature, licence, diffusion, crs, avancement, publication, compression, dateLivraison, isFormOpen, handleEdition, handleDelete}) => (
  <div className={`fr-grid-row fr-grid-row--middle fr-grid-row--gutters fr-col-lg-12 fr-p-2w card-container ${isFormOpen ? 'card-disable' : ''}`}>
    <div className='fr-grid-row fr-grid-row--middle fr-grid-row--gutters fr-col-lg-11'>
      {/* ---------------------- Top ---------------------- */}
      <div className='fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-col-12 infos-row'>
        <div className='fr-grid-row fr-col-12 fr-col-md-3'>
          <div className='label fr-col-12'>Nom</div>
          <div className='fr-col-12 fr-text--sm fr-m-0'>{nom}</div>
        </div>

        <div className='fr-grid-row fr-col-12 fr-col-md-3'>
          <div className='label fr-col-12'>Nature</div>
          <div className='fr-col-12 fr-text--sm fr-m-0'>{nature}</div>
        </div>

        <div className='fr-grid-row fr-col-12 fr-col-md-2'>
          <div className='label fr-col-12'>Diffusion</div>
          <div className='fr-col-12 fr-text--sm fr-m-0'>{diffusion || 'N/A'}</div>
        </div>

        <div className='fr-grid-row fr-col-12 fr-col-md-2'>
          <div className='label fr-col-12'>Licence</div>
          <div className='fr-col-12 fr-text--sm fr-m-0'>{licence}</div>
        </div>

        <div className='fr-grid-row fr-col-12 fr-col-md-2'>
          <div className='label fr-col-12'>Avancement</div>
          <div className='fr-col-12 fr-text--sm fr-m-0'>{avancement || 'N/A'}</div>
        </div>
      </div>

      {/* ---------------------- Bottom ---------------------- */}
      <div className='fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-col-12 infos-row'>
        <div className='fr-grid-row fr-col-12 fr-col-md-3'>
          <div className='label fr-col-12'>Publication</div>
          <div className='fr-col-12 fr-text--sm fr-m-0'>{publication || 'N/A'}</div>
        </div>

        <div className='fr-grid-row fr-col-12 fr-col-md-3'>
          <div className='label fr-col-12'>Système de référence spatial</div>
          <div className='fr-col-12 fr-text--sm fr-m-0'>{crs || 'N/A'}</div>
        </div>

        <div className='fr-grid-row fr-col-12 fr-col-md-2'>
          <div className='label fr-col-12'>Compression</div>
          <div className='fr-col-12 fr-text--sm fr-m-0'>{compression || 'N/A'}</div>
        </div>

        <div className='fr-grid-row fr-col-12 fr-col-md-2'>
          <div className='label fr-col-12'>Date de livraison</div>
          <div className='fr-col-12 fr-text--sm fr-m-0'>{dateLivraison || 'N/A'}</div>
        </div>
        <div className='fr-col-offset-2' />
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

LivrableCard.propTypes = {
  nom: PropTypes.string.isRequired,
  nature: PropTypes.string.isRequired,
  licence: PropTypes.string.isRequired,
  diffusion: PropTypes.string,
  avancement: PropTypes.number,
  crs: PropTypes.string,
  compression: PropTypes.string,
  dateLivraison: PropTypes.string,
  isFormOpen: PropTypes.bool.isRequired,
  publication: PropTypes.string,
  handleDelete: PropTypes.func.isRequired,
  handleEdition: PropTypes.func.isRequired
}

LivrableCard.defaultProps = {
  publication: null,
  diffusion: null,
  avancement: null,
  crs: null,
  compression: null,
  dateLivraison: null
}

export default LivrableCard
