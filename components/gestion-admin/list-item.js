import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

import {shortDate} from '@/lib/date-utils.js'

const ListItem = ({email, nom, creationDate, handleModal, handleEdit}) => (
  <>
    <div className='fr-grid-row fr-grid-row--middle fr-p-2w card-container'>
      <div className='fr-col-12 fr-col-md-1'>
        <span
          className='fr-icon-user-fill'
          style={{color: colors.darkgrey}}
          aria-hidden='true'
        />
      </div>

      <div className='fr-grid-row fr-grid-row--gutters fr-col-12 fr-col-md-9 fr-mt-2w fr-mt-md-0'>
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

      <div className='fr-grid-row fr-col-12 fr-grid-row--start fr-col-md-2 fr-mt-2w'>
        <button
          type='button'
          className='fr-grid-row fr-col-md-6 action-button'
          onClick={handleEdit}
        >
          <span className='fr-icon-pencil-line fr-pr-1w fr-pr-md-0 fr-col-12' aria-hidden='true' />
          <div className='fr-col-12'>Éditer</div>
        </button>

        <button
          type='button'
          className='fr-grid-row fr-col-md-6 action-button revoke-button'
          onClick={handleModal}
        >
          <span className='fr-icon-close-circle-line fr-pr-1w fr-pr-md-0 fr-col-12' aria-hidden='true' />
          <div className='fr-col-12'>Révoquer</div>
        </button>
      </div>
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

      .action-button:hover{
        text-decoration: underline;
      }

      .action-button:disabled {
        border-color: ${colors.grey850};
        color: ${colors.grey200};
      }

      .revoke-button {
        color: ${colors.error425};
      }
    `}</style>
  </>
)

ListItem.propTypes = {
  email: PropTypes.string.isRequired,
  nom: PropTypes.string,
  creationDate: PropTypes.string.isRequired,
  handleModal: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired
}

export default ListItem
