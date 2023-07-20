import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

import {shortDate} from '@/lib/date-utils.js'

const Card = ({email, nom, creationDate, handleModal}) => (
  <div className='fr-grid-row fr-grid-row--middle fr-p-2w card-container'>
    <div className='fr-col-12 fr-col-md-1'>
      <span className='fr-icon-user-fill' style={{color: `${colors.blueFranceSun113}`}} aria-hidden='true' />
    </div>

    <div className='fr-grid-row fr-grid-row--gutters fr-col-12 fr-col-md-10 fr-mt-2w fr-mt-md-0'>
      <div className='fr-grid-row fr-col-12 fr-col-md-4'>
        <div className='label fr-col-12'>Nom</div>
        <div className='fr-col-12 fr-text--sm fr-m-0'>{nom || 'N/A'}</div>
      </div>

      <div className='fr-grid-row fr-col-12 fr-col-md-4'>
        <div className='label fr-col-12'>Email</div>
        <div className='fr-col-12 fr-text--sm fr-m-0'>{email}</div>
      </div>

      <div className='fr-grid-row fr-col-12 fr-col-md-4'>
        <div className='label fr-col-12'>Date d’ajout</div>
        <div className='fr-col-12 fr-text--sm fr-m-0'>{shortDate(creationDate)}</div>
      </div>
    </div>

    <div className='fr-grid-row fr-grid-row--middle fr-col-12 fr-col-md-1 fr-p-0 fr-mt-2w fr-mt-md-0 button-container'>
      <button
        type='button'
        className='fr-grid-row fr-col-md-12 fr-grid-row--center fr-grid-row--middle revoke-modal-button'
        onClick={handleModal}
      >
        <span className='fr-icon-close-circle-line fr-pr-1w fr-pr-md-0' aria-hidden='true' />
        <div>Révoquer</div>
      </button>
    </div>

    <style jsx>{`
      .card-container {
        background: ${colors.grey975};
        border-radius: 4px;
      }

      .label {
        font-weight: bold;
        color: ${colors.blueFranceSun113};
      }

      .revoke-modal-button {
        color: ${colors.error425};
      }

      .revoke-modal-button:hover {
        text-decoration: underline;
      }

      .revoke-button {
        color: ${colors.redMarianne425};
        font-weight: bold;
        border: 1px solid ${colors.redMarianne425};
        font-size: 1rem;
        background: transparent;
      }

      .revoke-button:hover {
        background: ${colors.error950};
      }

      .revoke-button:hover:disabled {
        background-color: ${colors.grey900};
      }

      .revoke-button:disabled {
        border-color: ${colors.grey850};
        color: ${colors.grey200};
      }
    `}</style>
  </div>
)

Card.propTypes = {
  email: PropTypes.string.isRequired,
  nom: PropTypes.string,
  creationDate: PropTypes.string.isRequired,
  handleModal: PropTypes.func.isRequired
}

export default Card
