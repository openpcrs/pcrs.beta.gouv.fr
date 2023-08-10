import {useState} from 'react'
import PropTypes from 'prop-types'

import {deleteCreator} from '@/lib/suivi-pcrs.js'

import ListItem from '@/components/gestion-admin/list-item.js'
import Modal from '@/components/modal.js'

const PorteurList = ({token, porteurs, error, addError, clearError, handleReloadPorteurs}) => {
  const [validationMessage, setValidationMessage] = useState(null)
  const [selectedPorteurId, setSelectedPorteurId] = useState(null)

  const handleConfirmationModal = id => {
    clearError('revokeError')
    setValidationMessage(null)

    if (selectedPorteurId) {
      setSelectedPorteurId(null)
    } else {
      setSelectedPorteurId(id)
    }
  }

  const onRevoke = async (_id, nom) => {
    clearError('revokeError')

    try {
      await deleteCreator(_id, token)
      setValidationMessage(`Les droits de création de ${nom} ont été révoqués`)

      setTimeout(() => {
        handleReloadPorteurs()
      }, 2000)
    } catch {
      addError('revokeError', `Les droits de création de ${nom} n’ont pas été révoqués`)
    }
  }

  return (
    <ul className='fr-mt-2w fr-p-0'>
      {porteurs.map(({_id, email, nom, _created}) => (
        <div key={_id}>
          <li className='fr-my-2w'>
            <ListItem
              email={email}
              nom={nom}
              creationDate={_created}
              handleModal={() => handleConfirmationModal(_id)}
            />
          </li>

          {selectedPorteurId === _id && (
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
                    onClick={() => onRevoke(_id, nom)}
                  >
                    <span className='fr-icon-close-circle-line fr-pr-1w' aria-hidden='true' />Révoquer {nom}
                  </button>
                  {validationMessage && (
                    <p className='fr-grid-row fr-grid-row--center fr-valid-text fr-col-12 fr-mt-2w fr-mb-0'>
                      {validationMessage}
                    </p>
                  )}

                  {error && (
                    <p className='fr-grid-row fr-grid-row--center fr-error-text fr-col-12 fr-mt-2w fr-mb-0'>
                      {error}
                    </p>
                  )}
                </div>
              </div>
            </Modal>
          )}
        </div>
      ))}
    </ul>
  )
}

PorteurList.propTypes = {
  token: PropTypes.string.isRequired,
  porteurs: PropTypes.array.isRequired,
  error: PropTypes.string,
  addError: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
  handleReloadPorteurs: PropTypes.func.isRequired
}

PorteurList.defaultProps = {
  error: null
}

export default PorteurList
