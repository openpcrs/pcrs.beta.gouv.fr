import {useState, useEffect, useCallback, useContext} from 'react'
import {orderBy} from 'lodash'

import {getCreators} from '@/lib/suivi-pcrs.js'

import PorteurList from '@/components/gestion-admin/porteur-list.js'
import Header from '@/components/gestion-admin/header.js'
import Loader from '@/components/loader.js'

import AuthentificationContext from '@/contexts/authentification-token.js'

const Porteurs = () => {
  const {token, isTokenRecovering} = useContext(AuthentificationContext)

  const [errorMessage, setErrorMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [porteurs, setPorteurs] = useState([])
  const [filteredPorteurs, setFilteredPorteurs] = useState([])

  const getPorteurs = useCallback(async () => {
    try {
      const getPorteurs = await getCreators(token)

      setPorteurs(orderBy(getPorteurs, [item => item.nom ? item.nom.toLowerCase() : 'N/A'.toLowerCase()], ['asc']))
    } catch {
      setErrorMessage('La liste des porteurs de projets n’a pas pu être récupérée')
    }

    setIsLoading(false)
  }, [token])

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
      />

      {filteredPorteurs.length > 0 ? (
        <PorteurList token={token} porteurs={filteredPorteurs} />
      ) : (
        <p className='fr-mt-4w'> <i>La liste des porteurs de projets autorisés est vide.</i></p>
      )}

      {errorMessage && <p className='fr-error-text'>{errorMessage}</p>}
    </div>
  )
}

export default Porteurs
