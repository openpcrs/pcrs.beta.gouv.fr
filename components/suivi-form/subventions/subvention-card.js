import PropTypes from 'prop-types'
import {formatDate} from '@/lib/date-utils.js'

import colors from '@/styles/colors.js'

const SubventionCard = ({nom, nature, montant, echeance, natures, handleDelete, handleEdition}) => (
  <div className='fr-grid-row fr-p-2w fr-my-3w card-container'>
    <div className='fr-grid-row fr-col-10'>
      <div className='fr-grid-row fr-col-12 fr-col-xl-6'>
        <div className='fr-grid-row fr-grid-row--middle fr-col-12 fr-col-md-6 fr-p-1w'>
          <div className='fr-col-12 fr-col-md-11'>
            <div className='label fr-col-12 fr-text--lg fr-m-0'>Nom</div>
            <div className='fr-m-0 fr-col-12 fr-text--sm'>{nom}</div>
          </div>
        </div>

        <div className='fr-grid-row col-12 fr-col-md-6 fr-p-1w'>
          <div className='label fr-col-12 fr-text--lg fr-m-0'>Nature</div>
          <div className='fr-m-0 fr-col-12 fr-text--sm'>{natures.find(n => n.value === nature).label}</div>
        </div>
      </div>

      <div className='fr-grid-row fr-col-12 fr-col-xl-6'>
        <div className='fr-grid-row fr-col-12 fr-col-md-6 fr-p-1w'>
          <div className=' label fr-col-12 fr-text--lg fr-m-0'>Montant</div>
          <div className='fr-m-0 fr-col-12 fr-text--sm'>{montant || 'N/A'}</div>
        </div>

        <div className='fr-grid-row col-12 fr-col-md-6 fr-p-1w'>
          <div className='label fr-col-12 fr-text--lg fr-m-0'>Échéance</div>
          <div className='fr-m-0 fr-col-12 fr-text--sm'>{echeance ? `le ${formatDate(echeance)}` : 'N/A'}</div>
        </div>
      </div>
    </div>

    <div className='fr-grid-row fr-col-12 fr-col-md-2 fr-mt-3w fr-mt-md-0 fr-pl-md-1w fr-grid-row--middle '>
      <button
        type='button'
        className='fr-grid-row fr-col-md-12 fr-col-lg-6 update-button'
        onClick={handleEdition}
      >
        <span className='fr-icon-edit-line fr-col-12' aria-hidden='true' />
        <div className='fr-col-12'>Modifier</div>
      </button>

      <button
        type='button'
        className='fr-grid-row fr-col-md-12 fr-col-lg-6 fr-pl-1w delete-button'
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

SubventionCard.propTypes = {
  nom: PropTypes.string.isRequired,
  nature: PropTypes.string.isRequired,
  montant: PropTypes.number,
  echeance: PropTypes.string,
  natures: PropTypes.array.isRequired,
  handleEdition: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired
}

SubventionCard.defaultProps = {
  montant: null,
  echeance: ''
}

export default SubventionCard
