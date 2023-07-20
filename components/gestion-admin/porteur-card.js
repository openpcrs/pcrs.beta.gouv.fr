import {useState} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'

import {deleteCreator} from '@/lib/suivi-pcrs.js'

import Card from '@/components/gestion-admin/card.js'
import Modal from '@/components/modal.js'

const PorteurCard = ({token, _id, email, nom, _created}) => {
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
    <div>
      <Card email={email} nom={nom} creationDate={_created} handleModal={handleConfirmationModal} />

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
    </div>
  )
}

PorteurCard.propTypes = {
  token: PropTypes.string.isRequired,
  _id: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  nom: PropTypes.string.isRequired,
  _created: PropTypes.string.isRequired
}

export default PorteurCard
