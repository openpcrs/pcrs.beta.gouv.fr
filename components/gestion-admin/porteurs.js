import {useState, useEffect, useCallback, useContext} from 'react'
import {orderBy} from 'lodash-es'

import {getCreators} from '@/lib/suivi-pcrs.js'

import PorteurCard from '@/components/gestion-admin/porteur-card.js'
import NewPorteurForm from '@/components/gestion-admin/new-porter-form.js'
import Loader from '@/components/loader.js'
import Button from '@/components/button.js'
import SelectInput from '@/components/select-input.js'

import AuthentificationContext from '@/contexts/authentification-token.js'

const orderOptions = [
  {value: 'alpha', label: 'Ordre alphabétique'},
  {value: 'asc', label: 'Date d’ajout croissante'},
  {value: 'desc', label: 'Date d’ajout décroissante'}
]

const Porteurs = () => {
  const {token, isTokenRecovering} = useContext(AuthentificationContext)

  const [errorMessage, setErrorMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const [porteurs, setPorteurs] = useState([])
  const [search, setSearch] = useState('')
  const [filteredPorteurs, setFilteredPorteurs] = useState([])
  const [orderValue, setOrderValue] = useState('alpha')

  const getPorteurs = useCallback(async () => {
    try {
      const getPorteurs = await getCreators(token)
      const orderByName = orderBy(getPorteurs, ['nom'], ['asc'])

      setPorteurs(orderByName)
      setFilteredPorteurs(orderByName)
    } catch {
      setErrorMessage('La liste des porteurs de projets n’a pas pu être récupérée')
    }

    setIsLoading(false)
  }, [token])

  const handleFormOpen = () => setIsFormOpen(!isFormOpen)

  useEffect(() => {
    if (token && !isTokenRecovering) {
      getPorteurs()
    }
  }, [token, isTokenRecovering, getPorteurs])

  useEffect(() => {
    if (search) {
      const filteredResults = porteurs.filter(porteur => porteur.email.toLowerCase().includes(search.toLowerCase()) || porteur?.nom?.toLowerCase()?.includes(search.toLowerCase()))
      setFilteredPorteurs(filteredResults)
    } else {
      setFilteredPorteurs(porteurs)
    }
  }, [porteurs, search])

  useEffect(() => {
    if (orderValue === 'alpha') {
      setFilteredPorteurs(orderBy(porteurs, ['nom'], ['asc']))
    }

    if (orderValue === 'asc') {
      const ascOrder = orderBy(porteurs, ['_created'], ['asc'])
      setFilteredPorteurs(ascOrder)
    }

    if (orderValue === 'desc') {
      const descOrder = orderBy(porteurs, ['_created'], ['desc'])
      setFilteredPorteurs(descOrder)
    }
  }, [orderValue, porteurs])

  return isLoading ? (
    <div className='fr-grid-row fr-col-12 fr-grid-row--center fr-my-3w'><Loader /></div>
  ) : (
    <div>
      <Button
        icon='user-add-line'
        iconSide='right'
        label='Autoriser un nouveau porteur'
        isDisabled={isFormOpen}
        onClick={handleFormOpen}
      >
        Autoriser un nouveau porteur
      </Button>

      {isFormOpen && (
        <NewPorteurForm
          token={token}
          onClose={handleFormOpen}
          onRefetch={getPorteurs}
        />
      )}

      <div className='fr-grid-row fr-grid-row--middle fr-mt-8w'>
        <div className='fr-col-12 fr-col-md-4'>
          <label className='fr-label fr-mb-1w'>
            <b>Rechercher un porteur</b>
          </label>
          <div className='fr-search-bar' >
            <input
              className='fr-input'
              placeholder='Rechercher par nom ou email'
              type='search'
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className='fr-grid-row fr-grid-row--right fr-col-12 fr-col-md-8 fr-mt-6w fr-mt-md-0'>
          <SelectInput
            label='Trier par :'
            ariaLabel='Ordonner les porteurs par date d’ajout ou par ordre alphabétique'
            value={orderValue}
            options={orderOptions}
            onValueChange={e => setOrderValue(e.target.value)}
          />
        </div>
      </div>

      {filteredPorteurs.length > 0 ? (
        <ul className='fr-mt-2w fr-p-0'>
          {filteredPorteurs.map(porteur => (
            <li key={porteur._id} className='fr-my-2w'>
              <PorteurCard
                token={token}
                onRefetch={getPorteurs}
                {...porteur}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className='fr-mt-4w'> <i>La liste des porteurs de projets autorisés est vide.</i></p>
      )}

      {errorMessage && <p className='fr-error-text'>{errorMessage}</p>}
    </div>
  )
}

export default Porteurs
