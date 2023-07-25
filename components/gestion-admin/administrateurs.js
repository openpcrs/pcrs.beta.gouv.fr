import {useState, useEffect, useCallback, useContext} from 'react'
import {orderBy} from 'lodash'

import {getAdministrators, addAdministator} from '@/lib/suivi-pcrs.js'

import AuthentificationContext from '@/contexts/authentification-token.js'

import AdministrateurList from '@/components/gestion-admin/administrateur-list.js'
import Header from '@/components/gestion-admin/header.js'
import Loader from '@/components/loader.js'

const Administrateurs = () => {
  const {token, isTokenRecovering} = useContext(AuthentificationContext)

  const [admins, setAdmins] = useState([])
  const [filteredAdmins, setFilteredAdmins] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [validationMessage, setValidationMessage] = useState(null)
  const [errorMessages, setErrorMessages] = useState({headerError: null, fetchError: null})

  const getAdmins = useCallback(async () => {
    setIsLoading(true)
    setErrorMessages(errorMessages => ({...errorMessages, fetchError: null}))

    try {
      const administrators = await getAdministrators(token)

      setAdmins(orderBy(administrators, [item => item.nom ? item.nom.toLowerCase() : 'N/A'.toLowerCase()], ['asc']))
    } catch {
      setErrorMessages(errorMessages => ({...errorMessages, fetchError: 'Une erreur a été rencontrée lors de la récupération des administrateurs'}))
    }

    setIsLoading(false)
  }, [token])

  const onAddAdmin = async (nom, email) => {
    setValidationMessage(null)
    setErrorMessages(errorMessages => ({...errorMessages, headerError: null}))

    try {
      await addAdministator(token, {nom, email})
      setValidationMessage(`${nom} a été ajouté à la liste des administrateurs`)

      setTimeout(() => {
        getAdmins()
      }, 1000)
    } catch {
      setErrorMessages(errorMessages => ({...errorMessages, headerError: 'Le nouvel administrateur n’a pas pu être ajouté'}))
    }
  }

  useEffect(() => {
    if (token && !isTokenRecovering) {
      getAdmins()
    }
  }, [token, isTokenRecovering, getAdmins])

  return isLoading ? (
    <div className='fr-grid-row fr-col-12 fr-grid-row--center fr-my-3w'><Loader /></div>
  ) : (
    <div>
      <Header
        isAdmin
        token={token}
        items={admins}
        handleFilteredItems={setFilteredAdmins}
        handleReloadData={getAdministrators}
        errorMessage={errorMessages.headerError}
        validationMessage={validationMessage}
        onAdd={onAddAdmin}
      />

      {filteredAdmins.length > 0 ? (
        <AdministrateurList
          loggedUserToken={token}
          administrateurs={filteredAdmins}
          handleReloadAdmins={getAdmins}
        />
      ) : (
        <p className='fr-mt-4w'> <i>La liste des administrateurs est vide.</i></p>
      )}

      {errorMessages.fetchError && <p className='fr-error-text'>{errorMessages.fetchError}</p>}
    </div>
  )
}

export default Administrateurs
