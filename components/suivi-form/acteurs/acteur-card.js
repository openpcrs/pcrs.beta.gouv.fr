/* eslint-disable camelcase */
import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

const ActeurCard = ({siren, nom, telephone, role, finance_part_euro, finance_part_perc, roles, handleDelete, handleEdition}) => {
  const isAplc = role === 'aplc'

  return (
    <div className='fr-grid-row fr-p-2w fr-my-3w card-container'>
      <div className='fr-grid-row fr-col-10'>
        <div className='fr-grid-row fr-col-12 fr-col-xl-4'>
          <div className='fr-grid-row col-12 fr-col-md-6 fr-p-1w'>
            {isAplc && <span className='fr-grid-row fr-grid-row--middle fr-icon-user-star-fill fr-col-md-1 fr-icon--lg aplc-icon' aria-hidden='true' />}
            <div className={`fr-grid-row fr-col-12 fr-col-md-11 ${isAplc ? 'fr-pl-2w fr-pl-md-4w' : ''}`}>
              <div className='label fr-col-12 fr-m-0'>Nom</div>
              <div className='fr-m-0 fr-col-12 fr-text--sm'>{nom}</div>
            </div>
          </div>

          <div className='fr-grid-row col-12 fr-col-md-6 fr-p-1w'>
            <div className='label fr-col-12 fr-m-0'>Siren</div>
            <div className='fr-m-0 fr-col-12 fr-text--sm'>{siren}</div>
          </div>
        </div>

        <div className='fr-grid-row fr-col-12 fr-col-xl-4'>
          <div className='fr-grid-row fr-col-12 fr-col-md-6 fr-p-1w'>
            <div className=' label fr-col-12 fr-m-0'>Téléphone</div>
            <div className='fr-m-0 fr-col-12 fr-text--sm'>{telephone || 'N/A'}</div>
          </div>

          <div className='fr-grid-row col-12 fr-col-md-6 fr-p-1w'>
            <div className='label fr-col-12 fr-m-0'>Rôle</div>
            <div className='fr-m-0 fr-col-12 fr-text--sm'>{roles.find(r => r.value === role).label}</div>
          </div>
        </div>

        <div className='fr-grid-row fr-col-12 fr-col-xl-4'>
          <div className='fr-grid-row fr-col-12 fr-col-md-6 fr-p-1w'>
            <div className=' label fr-col-12 fr-m-0'>Financement (%)</div>
            <div className='fr-m-0 fr-col-12 fr-text--sm'>{finance_part_perc || 'N/A'}</div>
          </div>

          <div className='fr-grid-row col-12 fr-col-md-6 fr-p-1w'>
            <div className='label fr-col-12 fr-m-0'>Financement (€)</div>
            <div className='fr-m-0 fr-col-12 fr-text--sm'>{finance_part_euro || 'N/A'}</div>
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
}

ActeurCard.propTypes = {
  siren: PropTypes.number.isRequired,
  nom: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  roles: PropTypes.array.isRequired,
  telephone: PropTypes.string,
  finance_part_euro: PropTypes.number,
  finance_part_perc: PropTypes.number,
  handleDelete: PropTypes.func.isRequired,
  handleEdition: PropTypes.func.isRequired
}

ActeurCard.defaultProps = {
  telephone: null,
  finance_part_euro: null,
  finance_part_perc: null
}

export default ActeurCard
