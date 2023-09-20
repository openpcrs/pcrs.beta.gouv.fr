import {useState, useEffect, useCallback, useContext} from 'react'
import {orderBy} from 'lodash'

import {getCreators, addCreator} from '@/lib/suivi-pcrs.js'
import {normalizeSort} from '@/lib/string.js'

import AuthentificationContext from '@/contexts/authentification-token.js'

import useToaster from '@/hooks/toaster.js'

import PorteurList from '@/components/gestion-admin/porteur-list.js'
import ToastsContainer from '@/components/toaster/toasts-container.js'
import Header from '@/components/gestion-admin/header.js'
import Loader from '@/components/loader.js'

const Porteurs = () => {
  const {token, isTokenRecovering} = useContext(AuthentificationContext)

  const [toasts, addToast, removeToast] = useToaster()

  const [errorMessages, setErrorMessages] = useState({headerError: null, fetchError: null})
  const [isLoading, setIsLoading] = useState(true)
  const [porteurs, setPorteurs] = useState([])
  const [filteredPorteurs, setFilteredPorteurs] = useState([])

  const getPorteurs = useCallback(async () => {
    setErrorMessages(errorMessages => ({...errorMessages, fetchError: null}))

    try {
      const getPorteurs = await getCreators(token)

      setPorteurs(orderBy(getPorteurs, [item => normalizeSort(item.nom || 'N/A')], ['asc']))
    } catch {
      setErrorMessages(errorMessages => ({...errorMessages, fetchError: 'La liste des porteurs de projets n’a pas pu être récupérée'}))
    }

    setIsLoading(false)
  }, [token])

  const onAddCreators = async (nom, email) => {
    setErrorMessages(errorMessages => ({...errorMessages, headerError: null}))

    try {
      await addCreator(token, {nom, email})

      addToast({type: 'success', isClosable: true, content: `${nom} a été ajouté à la liste des porteurs autorisés`})
      getPorteurs()
    } catch (error) {
      setErrorMessages(errorMessages => ({...errorMessages, headerError: error.message}))
    }
  }

  useEffect(() => {
    if (token && !isTokenRecovering) {
      getPorteurs()
    }
  }, [token, isTokenRecovering, getPorteurs])

  return isLoading ? (
    <div className='fr-grid-row fr-col-12 fr-grid-row--center fr-my-3w'><Loader /></div>
  ) : (
    <div>
      <Header
        token={token}
        items={porteurs}
        errorMessage={errorMessages.headerError}
        handleFilteredItems={setFilteredPorteurs}
        handleReloadData={getPorteurs}
        isValid={toasts.length > 0}
        onAdd={onAddCreators}
      />

      {filteredPorteurs.length > 0 ? (
        <PorteurList
          token={token}
          porteurs={filteredPorteurs}
          handleReloadPorteurs={getPorteurs}
          addValidationMessage={addToast}
        />
      ) : (
        <p className='fr-mt-4w'> <i>La liste des porteurs de projets autorisés est vide.</i></p>
      )}

      {errorMessages.fetchError && <p className='fr-error-text'>{errorMessages.fetchError}</p>}

      <ToastsContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}

export default Porteurs
