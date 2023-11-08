import {useState, useEffect, useCallback, useContext} from 'react'
import {orderBy} from 'lodash-es'

import {getAdministrators, addAdministator} from '@/lib/suivi-pcrs.js'
import {normalizeSort} from '@/lib/string.js'

import AuthentificationContext from '@/contexts/authentification-token.js'

import useErrors from '@/hooks/errors.js'
import useToaster from '@/hooks/toaster.js'

import AdministrateurList from '@/components/gestion-admin/administrateur-list.js'
import ToastsContainer from '@/components/toaster/toasts-container.js'
import Header from '@/components/gestion-admin/header.js'
import Loader from '@/components/loader.js'

const Administrateurs = () => {
  const {token, isTokenRecovering} = useContext(AuthentificationContext)
  const [toasts, addToast, removeToast] = useToaster()

  const [admins, setAdmins] = useState()
  const [filteredAdmins, setFilteredAdmins] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setError, clearError] = useErrors({fetchError: null, headerError: null})

  const getAdmins = useCallback(async () => {
    clearError('fetchError')

    try {
      const administrators = await getAdministrators(token)

      setAdmins(orderBy(administrators, [item => normalizeSort(item.nom || 'N/A')], ['asc']))
    } catch (error) {
      setError('fetchError', error.message)
    }

    setIsLoading(false)
  }, [token, setError, clearError])

  const onAddAdmin = async (nom, email) => {
    clearError('headerError')

    try {
      await addAdministator(token, {nom, email})
      addToast({type: 'success', isClosable: true, content: `${nom} a été ajouté à la liste des administrateurs`})

      getAdmins()
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
        isValid={toasts.length > 0}
        onReset={() => clearError('headerError')}
        onAdd={onAddAdmin}
      />

      {filteredAdmins.length > 0 ? (
        <AdministrateurList
          loggedUserToken={token}
          administrateurs={filteredAdmins}
          handleReloadAdmins={getAdmins}
          addValidationMessage={addToast}
        />
      ) : !errors.fetchError && (
        <p className='fr-mt-4w'> <i>La liste des administrateurs est vide.</i></p>
      )}

      {errors.fetchError && <p className='fr-error-text'>{errors.fetchError}</p>}
      <ToastsContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}

export default Administrateurs
