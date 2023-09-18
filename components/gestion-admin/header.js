import {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {orderBy} from 'lodash-es'

import {normalizeSort} from '@/lib/string.js'

import Button from '@/components/button.js'
import SelectInput from '@/components/select-input.js'
import AddForm from '@/components/gestion-admin/add-form.js'

const orderOptions = [
  {value: 'alpha', label: 'Ordre alphabétique'},
  {value: 'asc', label: 'Date d’ajout croissante'},
  {value: 'desc', label: 'Date d’ajout décroissante'}
]

const Header = ({token, items, isAdmin, errorMessage, validationMessage, isValid, onAdd, handleFilteredItems, handleReloadData}) => {
  const [orderValue, setOrderValue] = useState('alpha')
  const [searchValue, setSearchValue] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleFormOpen = () => setIsFormOpen(!isFormOpen)

  useEffect(() => {
    if (searchValue) {
      const filteredResults = items.filter(item => item.email.toLowerCase().includes(searchValue.toLowerCase()) || item?.nom?.toLowerCase()?.includes(searchValue.toLowerCase()))
      handleFilteredItems(filteredResults)
    } else {
      handleFilteredItems(items)
    }
  }, [items, searchValue, handleFilteredItems])

  useEffect(() => {
    if (isValid) {
      setIsFormOpen(false)
    }
  }, [isValid])

  useEffect(() => {
    if (orderValue === 'alpha') {
      handleFilteredItems(orderBy(items, [item => normalizeSort(normalizeSort(item.nom || 'N/A'))], ['asc']))
    }

    if (orderValue === 'asc') {
      const ascOrder = orderBy(items, ['_created'], ['asc'])
      handleFilteredItems(ascOrder)
    }

    if (orderValue === 'desc') {
      const descOrder = orderBy(items, ['_created'], ['desc'])
      handleFilteredItems(descOrder)
    }
  }, [orderValue, items, handleFilteredItems])

  return (
    <div>
      <Button
        icon='user-add-line'
        iconSide='right'
        label={`Autoriser un ${isAdmin ? 'nouvel administrateur' : 'nouveau porteur'}`}
        isDisabled={isFormOpen}
        onClick={handleFormOpen}
      >
        Autoriser un {isAdmin ? 'nouvel administrateur' : 'nouveau porteur'}
      </Button>

      {isFormOpen && (
        <AddForm
          token={token}
          isAdmin={isAdmin}
          handleFormOpen={() => setIsFormOpen(!isFormOpen)}
          errorMessage={errorMessage}
          validationMessage={validationMessage}
          handleReloadData={handleReloadData}
          onSubmit={onAdd}
          onClose={handleFormOpen}
        />
      )}

      <div className='fr-grid-row fr-grid-row--middle fr-mt-8w'>
        <div className='fr-col-12 fr-col-md-4'>
          <label className='fr-label fr-mb-1w'>
            <b>Rechercher un {isAdmin ? 'administrateur' : 'porteur'}</b>
          </label>
          <div className='fr-search-bar' >
            <input
              className='fr-input'
              placeholder='Rechercher par nom ou email'
              type='search'
              onChange={e => setSearchValue(e.target.value)}
            />
          </div>
        </div>

        <div className='fr-grid-row fr-grid-row--right fr-col-12 fr-col-md-8 fr-mt-6w fr-mt-md-0'>
          <SelectInput
            label='Trier par :'
            ariaLabel={`Ordonner les ${isAdmin ? 'admin' : 'porteur'} par date d’ajout ou par ordre alphabétique`}
            value={orderValue}
            options={orderOptions}
            onValueChange={e => setOrderValue(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

Header.propTypes = {
  token: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
  validationMessage: PropTypes.string,
  items: PropTypes.array,
  isAdmin: PropTypes.bool,
  isValid: PropTypes.bool,
  onAdd: PropTypes.func.isRequired,
  handleFilteredItems: PropTypes.func.isRequired,
  handleReloadData: PropTypes.func.isRequired
}

Header.defaultProps = {
  errorMessage: null,
  items: [],
  validationMessage: null,
  isAdmin: false
}

export default Header
