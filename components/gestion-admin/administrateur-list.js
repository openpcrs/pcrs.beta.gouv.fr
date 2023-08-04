import {useState} from 'react'
import PropTypes from 'prop-types'

import {deleteAdministrator} from '@/lib/suivi-pcrs.js'

import ListItem from '@/components/gestion-admin/list-item.js'
import Modal from '@/components/modal.js'

const AdministrateurList = ({loggedUserToken, administrateurs, handleReloadAdmins}) => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [validationMessage, setValidationMessage] = useState(null)
  const [selectedAdminId, setSelectedAdminId] = useState(null)

  const handleConfirmationModal = id => {
    setErrorMessage(null)
    setValidationMessage(null)
    if (selectedAdminId) {
      setSelectedAdminId(null)
    } else {
      setSelectedAdminId(id)
    }
  }

  const onRevoke = async (_id, nom) => {
    setErrorMessage(null)

    try {
      await deleteAdministrator(_id, loggedUserToken)
      setValidationMessage(`Les droits administrateurs de ${nom} ont été révoqués`)

      setTimeout(() => {
        handleReloadAdmins()
      }, 2000)
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  return (
    <ul className='fr-mt-2w fr-p-0'>
      {administrateurs.map(({_id, email, nom, _created, token}) => (
        <div key={_id}>
          <li className='fr-my-2w'>
            <ListItem
              email={email}
              nom={nom}
              creationDate={_created}
              isAdmin={loggedUserToken === token}
              handleModal={() => handleConfirmationModal(_id)}
            />
          </li>

          {selectedAdminId === _id && (
            <Modal title='Êtes-vous sûr de révoquer les droits de cet administrateur ?' onClose={handleConfirmationModal}>
              <div className='fr-grid-row fr-grid-row--center'>
                <div className='fr-alert fr-col-12 fr-alert--warning fr-alert--sm fr-my-5w'>
                  <p><b>{nom}</b> perdra ses droits administrateur et ne sera plus en mesure de créer <b>des projets</b> ou bien gérer <b>les porteurs</b> et <b>les administrateurs</b>. Si vous souhaitez <b>restaurer ses droits</b>, vous devrez de nouveau l’ajouter à la liste des <b>administrateurs autorisés</b>.</p>
                </div>

                <div className='fr-grid-row fr-grid-row--center'>
                  <button
                    disabled={Boolean(validationMessage)}
                    type='button'
                    aria-label='Révoquer le porteur'
                    className='fr-btn revoke-button fr-py-1w fr-px-1w'
                    onClick={() => onRevoke(_id, nom, token)}
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
      ))}
    </ul>
  )
}

AdministrateurList.propTypes = {
  loggedUserToken: PropTypes.string.isRequired,
  administrateurs: PropTypes.array.isRequired,
  handleReloadAdmins: PropTypes.func.isRequired
}

export default AdministrateurList
