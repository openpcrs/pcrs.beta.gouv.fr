import {useState} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'

import colors from '@/styles/colors.js'

import {deleteCreator} from '@/lib/suivi-pcrs.js'
import {shortDate} from '@/lib/date-utils.js'

import Modal from '@/components/modal.js'

const ListItem = ({_id, email, nom, _created, token}) => {
  const router = useRouter()

  const [errorMessage, setErrorMessage] = useState(null)
  const [validationMessage, setValidationMessage] = useState(null)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)

  const handleConfirmationModal = () => {
    setIsConfirmationModalOpen(!isConfirmationModalOpen)
    setErrorMessage(null)
    setValidationMessage(null)

    if (validationMessage) {
      router.reload(window.location.pathname)
    }
  }

  const onRevoke = async () => {
    setErrorMessage(null)

    try {
      await deleteCreator(_id, token)
      setValidationMessage(`Les droits de création de ${nom} ont été révoqués`)

      setTimeout(() => {
        router.reload(window.location.pathname)
      }, 2000)
    } catch {
      setErrorMessage(`Les droits de création de ${nom} n’ont pas été révoqués`)
    }
  }

  return (
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
          <div className='fr-col-12 fr-text--sm fr-m-0'>{shortDate(_created)}</div>
        </div>
      </div>

      <div className='fr-grid-row fr-grid-row--middle fr-col-12 fr-col-md-1 fr-p-0 fr-mt-2w fr-mt-md-0 button-container'>
        <button
          type='button'
          className='fr-grid-row fr-col-md-12 fr-grid-row--center fr-grid-row--middle revoke-modal-button'
          onClick={handleConfirmationModal}
        >
          <span className='fr-icon-close-circle-line fr-pr-1w fr-pr-md-0' aria-hidden='true' />
          <div>Révoquer</div>
        </button>
      </div>

      {isConfirmationModalOpen && (
        <Modal title='Êtes-vous sûr de révoquer les droits de ce porteur ?' onClose={handleConfirmationModal}>
          <div className='fr-grid-row fr-grid-row--center'>
            <div className='fr-alert fr-col-12 fr-alert--warning fr-alert--sm fr-my-5w'>
              <p><b>{nom}</b> ne sera plus dans <b>la capacité de créer un projet</b> de suivi du PCRS. Si vous souhaitez <b>restaurer ses droits</b>, vous devrez de nouveau l’ajouter à la liste <b>des porteurs autorisés</b>.</p>
            </div>

            <div className='fr-grid-row fr-grid-row--center'>
              <button
                disabled={Boolean(validationMessage)}
                type='button'
                aria-label='Révoquer le porteur'
                className='fr-btn revoke-button fr-py-1w fr-px-1w'
                onClick={onRevoke}
              >
                <span className='fr-icon-close-circle-line fr-pr-1w' aria-hidden='true' />Révoquer {nom}
              </button>
              {validationMessage && (
                <p className='fr-grid-row fr-grid-row--center fr-valid-text fr-col-12 fr-mt-2w fr-mb-0'>
                  {validationMessage}
                </p>
              )}

              {errorMessage && (
                <p className='fr-grid-row fr-grid-row--center fr-error-text fr-col-12 fr-mt-2w fr-mb-0'>
                  {errorMessage}
                </p>
              )}
            </div>
          </div>
        </Modal>
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
}

ListItem.propTypes = {
  _id: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  nom: PropTypes.string,
  _created: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired
}

export default ListItem
