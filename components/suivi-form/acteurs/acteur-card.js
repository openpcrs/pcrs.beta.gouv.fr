/* eslint-disable camelcase */
import PropTypes from 'prop-types'

import {getRoles} from '@/components/suivi-form/acteurs/utils/select-options.js'

import colors from '@/styles/colors.js'

const ActeurCard = ({actor, isDisabled, handleDelete, handleEdition}) => {
  const {siren, nom, mail, telephone, role, finance_part_euro, finance_part_perc} = actor
  const isAplc = role === 'aplc' || role === 'porteur'

  return (
    <div className={`fr-grid-row card-container fr-grid-row--middle fr-grid-row--gutters ${isDisabled ? 'card-disable' : ''} fr-p-2w fr-col-12`}>
      {isAplc && <span className='fr-grid-row fr-grid-row--middle fr-col-12 fr-col-lg-1 fr-icon-user-star-fill fr-icon--lg' aria-hidden='true' />}

      <div className={`fr-grid-row fr-grid-row--middle fr-grid-row--gutters ${isAplc ? 'fr-col-lg-10' : 'fr-col-lg-11'}`}>
        {/* ---------------------- Top ---------------------- */}
        <div className='fr-grid-row fr-grid-row--gutters fr-col-12 infos-row'>
          <div className='fr-grid-row fr-col-12 fr-col-md-3'>
            <div className='label fr-col-12'>Nom</div>
            <div className='fr-col-12 fr-text--sm fr-m-0'>{nom}</div>
          </div>

          <div className='fr-grid-row fr-col-12 fr-col-md-3'>
            <div className='label fr-col-12'>SIREN</div>
            <div className='fr-col-12 fr-text--sm fr-m-0'>{siren}</div>
          </div>

          <div className='fr-grid-row fr-col-12 fr-col-md-3'>
            <div className='label fr-col-12'>Financement (%)</div>
            <div className='fr-col-12 fr-text--sm fr-m-0'>{finance_part_perc || 'N/A'}</div>
          </div>

          <div className='fr-grid-row fr-col-12 fr-col-md-3'>
            <div className='label fr-col-12'>Financement (€)</div>
            <div className='fr-col-12 fr-text--sm fr-m-0'>{finance_part_euro || 'N/A'}</div>
          </div>
        </div>

        {/* ---------------------- Bottom ---------------------- */}
        <div className='fr-grid-row fr-grid-row--gutters fr-col-12 fr-mt-0 infos-row'>
          <div className='fr-grid-row fr-col-12 fr-col-md-3'>
            <div className='label fr-col-12'>Rôle</div>
            <div className='fr-col-12 fr-text--sm fr-m-0'>{getRoles()[role]}</div>
          </div>

          <div className='fr-grid-row fr-col-12 fr-col-md-3'>
            <div className='label fr-col-12'>Téléphone</div>
            <div className='fr-col-12 fr-text--sm fr-m-0'>{telephone || 'N/A'}</div>
          </div>

          <div className='fr-grid-row fr-col-12 fr-col-md-3'>
            <div className='label fr-col-12'>E-mail</div>
            <div className='fr-col-12 fr-text--sm fr-m-0'>{mail || 'N/A'}</div>
          </div>
        </div>
      </div>

      {!isDisabled && (
        <div className='fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-col-12 fr-col-lg-1 fr-p-0 fr-mt-1w fr-mt-md-0 buttons-container'>
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

        .infos-row, .buttons-container {
          height: fit-content;
        }

        .card-disable {
          opacity: 30%;
          pointer-events: none;
        }

        .aplc-icon {
          color: ${colors.success425};
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
  actor: PropTypes.shape({
    siren: PropTypes.number.isRequired,
    nom: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    telephone: PropTypes.string,
    mail: PropTypes.string,
    finance_part_euro: PropTypes.number,
    finance_part_perc: PropTypes.number
  }).isRequired,
  isDisabled: PropTypes.bool.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleEdition: PropTypes.func.isRequired
}

export default ActeurCard
