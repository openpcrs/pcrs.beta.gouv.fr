import {useState, useEffect, useCallback, useContext} from 'react'
import {orderBy} from 'lodash'

import {getCreators, addCreator} from '@/lib/suivi-pcrs.js'
import {normalizeSort} from '@/lib/string.js'

import useErrors from '@/hooks/errors.js'

import PorteurList from '@/components/gestion-admin/porteur-list.js'
import Header from '@/components/gestion-admin/header.js'
import Loader from '@/components/loader.js'

import AuthentificationContext from '@/contexts/authentification-token.js'

const Porteurs = () => {
  const {token, isTokenRecovering} = useContext(AuthentificationContext)

  const [errors, setError, clearError] = useErrors({fetchError: null, headerError: null, revokeError: null})
  const [validationMessage, setValidationMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [porteurs, setPorteurs] = useState([])
  const [filteredPorteurs, setFilteredPorteurs] = useState([])

  const getPorteurs = useCallback(async () => {
    clearError('fetchError')

    try {
      const getPorteurs = await getCreators(token)

      setPorteurs(orderBy(getPorteurs, [item => normalizeSort(item.nom || 'N/A')], ['asc']))
    } catch {
      setError('fetchError', 'La liste des porteurs de projets n’a pas pu être récupérée')
    }

    setIsLoading(false)
  }, [token, clearError, setError])

  const onAddCreators = async (nom, email) => {
    setValidationMessage(null)
    clearError('headerError')

    try {
      await addCreator(token, {nom, email})
      setValidationMessage(`${nom} a été ajouté à la liste des porteurs autorisés`)

      setTimeout(() => {
        getPorteurs()
      }, 1000)
    } catch {
      setError('headerError', 'Le nouveau porteur n’a pas pu être ajouté')
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
        handleFilteredItems={setFilteredPorteurs}
        handleReloadData={getPorteurs}
        errorMessage={errors.headerError}
        validationMessage={validationMessage}
        onReset={() => clearError('headerError')}
        onAdd={onAddCreators}
      />

      {filteredPorteurs.length > 0 ? (
        <PorteurList
          token={token}
          porteurs={filteredPorteurs}
          error={errors.revokeError}
          handleReloadPorteurs={getPorteurs}
          addError={setError}
          clearError={clearError}
        />
      ) : (
        <p className='fr-mt-4w'> <i>La liste des porteurs de projets autorisés est vide.</i></p>
      )}

      {errors.fetchError && <p className='fr-error-text'>{errors.fetchError}</p>}
    </div>
  )
}

export default Porteurs
