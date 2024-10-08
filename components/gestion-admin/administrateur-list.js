import {useState} from 'react'
import PropTypes from 'prop-types'

import {deleteAdministrator, editAdministator} from '@/lib/suivi-pcrs.js'

import ListItem from '@/components/gestion-admin/list-item.js'
import Modal from '@/components/modal.js'
import AddForm from '@/components/gestion-admin/add-form.js'

const AdministrateurList = ({loggedUserToken, administrateurs, addValidationMessage, handleReloadAdmins}) => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [selectedAdminId, setSelectedAdminId] = useState(null)
  const [editingAdmin, setEditingAdmin] = useState(null)

  const handleConfirmationModal = id => {
    setErrorMessage(null)

    if (selectedAdminId) {
      setSelectedAdminId(null)
    } else {
      setSelectedAdminId(id)
    }
  }

  const handleEditForm = id => {
    setErrorMessage(null)

    if (editingAdmin) {
      setEditingAdmin(null)
    } else {
      setEditingAdmin(id)
    }
  }

  const onRevoke = async (_id, nom) => {
    setErrorMessage(null)

    try {
      await deleteAdministrator(_id, loggedUserToken)

      addValidationMessage({type: 'success', isClosable: true, content: `Les droits administrateurs de ${nom} ont été révoqués`})
      handleReloadAdmins()
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  const onEdit = async (nom, email, id) => {
    setErrorMessage(null)

    try {
      await editAdministator(loggedUserToken, id, {nom, email})

      addValidationMessage({type: 'success', isClosable: true, content: 'L’administrateur a été modifié'})
      handleReloadAdmins()
      setEditingAdmin(null)
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
              handleModal={() => handleConfirmationModal(_id)}
              handleEdit={() => handleEditForm(_id)}
            />
          </li>

          {editingAdmin === _id && (
            <AddForm
              isAdmin
              initialValues={{nom, email}}
              editingItemId={_id}
              errorMessage={errorMessage}
              onClose={() => handleEditForm(null)}
              onSubmit={onEdit}
            />
          )}

          {selectedAdminId === _id && (
            <Modal title='Êtes-vous sûr de révoquer les droits de cet administrateur ?' onClose={handleConfirmationModal}>
              <div className='fr-grid-row fr-grid-row--center'>
                <div className='fr-alert fr-col-12 fr-alert--warning fr-alert--sm fr-my-5w'>
                  <p><b>{nom}</b> perdra ses droits administrateur et ne sera plus en mesure de créer <b>des projets</b> ou bien gérer <b>les porteurs</b> et <b>les administrateurs</b>. Si vous souhaitez <b>restaurer ses droits</b>, vous devrez de nouveau l’ajouter à la liste des <b>administrateurs autorisés</b>.</p>
                </div>

                <div className='fr-grid-row fr-grid-row--center'>
                  <button
                    type='button'
                    aria-label='Révoquer le porteur'
                    className='fr-btn revoke-button fr-py-1w fr-px-1w'
                    onClick={() => onRevoke(_id, nom, token)}
                  >
                    <span className='fr-icon-close-circle-line fr-pr-1w' aria-hidden='true' />Révoquer {nom}
                  </button>

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
  addValidationMessage: PropTypes.func.isRequired,
  handleReloadAdmins: PropTypes.func.isRequired
}

export default AdministrateurList
