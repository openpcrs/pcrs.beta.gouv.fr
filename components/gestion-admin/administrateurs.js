import {useState, useEffect, useCallback, useContext} from 'react'
import {orderBy} from 'lodash'

import {getAdministrators, addAdministator} from '@/lib/suivi-pcrs.js'
import {normalizeSort} from '@/lib/string.js'

import AuthentificationContext from '@/contexts/authentification-token.js'

import useErrors from '@/hooks/errors.js'

import AdministrateurList from '@/components/gestion-admin/administrateur-list.js'
import Header from '@/components/gestion-admin/header.js'
import Loader from '@/components/loader.js'

const Administrateurs = () => {
  const {token, isTokenRecovering} = useContext(AuthentificationContext)

  const [admins, setAdmins] = useState()
  const [filteredAdmins, setFilteredAdmins] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [validationMessage, setValidationMessage] = useState(null)
  const [errors, setError, clearError] = useErrors({fetchError: null, headerError: null})

  const getAdmins = useCallback(async () => {
    setIsLoading(true)
    clearError('fetchError')
    setIsLoading(true)

    try {
      const administrators = await getAdministrators(token)

      setAdmins(orderBy(administrators, [item => normalizeSort(item.nom || 'N/A')], ['asc']))
    } catch (error) {
      setError('fetchError', error.message)
    }

    setIsLoading(false)
  }, [token, setError, clearError])

  const onAddAdmin = async (nom, email) => {
    setValidationMessage(null)
    clearError('headerError')

    try {
      await addAdministator(token, {nom, email})
      setValidationMessage(`${nom} a été ajouté à la liste des administrateurs`)

      setTimeout(() => {
        getAdmins()
        setValidationMessage(null)
      }, 1000)
    } catch (error) {
      setError('headerError', error.message)
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
        errorMessage={errors.headerError}
        validationMessage={validationMessage}
        onReset={() => clearError('headerError')}
        onAdd={onAddAdmin}
      />

      {filteredAdmins.length > 0 ? (
        <AdministrateurList
          loggedUserToken={token}
          administrateurs={filteredAdmins}
          handleReloadAdmins={getAdmins}
        />
      ) : !errors.fetchError && (
        <p className='fr-mt-4w'> <i>La liste des administrateurs est vide.</i></p>
      )}

      {errors.fetchError && <p className='fr-error-text'>{errors.fetchError}</p>}
    </div>
  )
}

export default Administrateurs
