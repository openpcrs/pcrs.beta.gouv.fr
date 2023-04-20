import {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {debounce} from 'lodash-es'

import {getPerimetersByName, getPerimetersByCode} from '@/lib/decoupage-administratif-api.js'

import colors from '@/styles/colors.js'

import AutocompleteInput from '@/components/autocomplete-input.js'
import SelectInput from '@/components/select-input.js'
import Button from '@/components/button.js'

const TYPES = [
  {label: 'EPCI', value: 'epci'},
  {label: 'Commune', value: 'commune'},
  {label: 'Département', value: 'departement'}
]

const renderItem = (item, isHighlighted) => {
  const {nom, code} = item

  return (
    <div key={code} className='item fr-px-1w fr-py-2w'>
      {nom} - {code}

      <style jsx>{`
        .item {
          background: ${isHighlighted ? colors.blueHover : 'white'};
          color: ${isHighlighted ? 'white' : colors.darkgrey};
        }

        .ape {
          font-weight: bold;
        }
      `}</style>
    </div>
  )
}

const PerimetreForm = ({perimetres, handlePerimetres, isEditing, perimetreAsObject, updatingPerimetreIdx, handleUpdatingPerimetreIdx, handleAdding, handleEditing, onRequiredFormOpen}) => {
  const [hasMissingInput, setHasMissingInput] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [code, setCode] = useState('')
  const [nom, setNom] = useState('')
  const [type, setType] = useState('')

  const [foundPerimetres, setFoundPerimetres] = useState([])
  const [updatingPerimetreCode, setUpdatingPerimetreCode] = useState()
  const [errorMessage, setErrorMessage] = useState()

  const handleErrors = useCallback(input => {
    if (!input && hasMissingInput) {
      return 'Ce champs est requis'
    }
  }, [hasMissingInput])

  const onReset = () => {
    setNom('')
    setCode('')
    setType('')
    handleUpdatingPerimetreIdx(null)
    handleAdding(false)
    handleEditing(false)
    onRequiredFormOpen(false)
    setHasMissingInput(false)
    setUpdatingPerimetreCode(null)
    setErrorMessage(null)
  }

  const onAdd = () => {
    if (type && code) {
      if (perimetres.includes(`${type}:${code}`)) {
        setErrorMessage('Ce périmètre est déjà présent.')
      } else {
        handlePerimetres([...perimetres, `${type}:${code}`])

        onReset()
      }
    } else {
      setHasMissingInput(true)
    }
  }

  const onUpdate = () => {
    if (type && code) {
      if (perimetres.includes(`${type}:${code}`) && updatingPerimetreCode !== code) {
        setErrorMessage('Ce périmètre est déjà présent.')
      } else {
        handlePerimetres([...perimetres].map((perimetre, idx) => {
          if (idx === updatingPerimetreIdx) {
            perimetre = `${type}:${code}`
          }

          return perimetre
        }))

        onReset()
      }
    } else {
      setHasMissingInput(true)
    }
  }

  useEffect(() => {
    // Switch to perimetre update form
    if (isEditing) {
      const {perimetreCode, perimetreType} = perimetreAsObject(perimetres[updatingPerimetreIdx])
      try {
        const switchToUpdateForm = async () => {
          const perimetre = await getPerimetersByCode(perimetreCode, perimetreType)
          setNom(perimetre.nom)
          setCode(perimetre.code)
          setType(perimetreType)
          setUpdatingPerimetreCode(perimetre.code)
          onRequiredFormOpen(true)
        }

        switchToUpdateForm()
      } catch {
        console.log('Impossible de retrouver le périmètre')
      }
    }
  }, [perimetres, isEditing, perimetreAsObject, updatingPerimetreIdx, onRequiredFormOpen])

  const fetchPerimetres = useCallback(debounce(async (nom, type, signal) => {
    setIsLoading(true)

    try {
      const perimetres = await getPerimetersByName(nom, type, signal)
      setFoundPerimetres(perimetres)
    } catch {
      if (!signal.aborted) {
        setFoundPerimetres([])
      }
    }

    setIsLoading(false)
  }, 300), [setFoundPerimetres, setIsLoading])

  useEffect(() => {
    if (!nom || nom.length < 3) {
      return
    }

    const ac = new AbortController()
    fetchPerimetres(nom, type, ac.signal)

    return () => {
      ac.abort()
    }
  }, [nom, type, fetchPerimetres])

  const handleChange = value => {
    setType(value)

    if (value !== type) {
      setNom('')
      setCode('')
      setFoundPerimetres([])
    }
  }

  const handleSelect = item => {
    const foundPerimetreName = foundPerimetres.find(result => result.code === item).nom

    setCode(item)
    setNom(foundPerimetreName)
  }

  return (
    <div>
      <div className='fr-grid-row fr-my-5w'>
        <div className='fr-col-12 fr-col-md-6 fr-mb-3w'>
          <SelectInput
            isRequired
            label='Type'
            value={type}
            options={TYPES}
            ariaLabel='types de territoire'
            description='Types de territoire'
            errorMessage={handleErrors(type)}
            onValueChange={e => handleChange(e.target.value)}
          />
        </div>

        {type && (
          <div className='fr-col-12 fr-col-md-6 fr-pl-md-3w'>
            <AutocompleteInput
              isRequired
              label='Nom'
              value={nom}
              description='Nom du territoire *'
              ariaLabel='rechercher le nom du territoire'
              errorMessage={handleErrors(nom)}
              results={foundPerimetres}
              customItem={renderItem}
              isLoading={isLoading}
              getItemValue={item => item.code}
              onValueChange={e => setNom(e.target.value)}
              onSelectValue={item => handleSelect(item)}
            />
          </div>
        )}
      </div>

      <div className='fr-grid-row'>
        <Button
          label='Valider l’ajout du périmètre'
          icon='checkbox-circle-fill'
          onClick={() => isEditing ? onUpdate() : onAdd()}
        >
          Valider
        </Button>
        <div className='fr-pl-3w'>
          <Button
            label='Annuler l’ajout du périmètre'
            buttonStyle='tertiary'
            onClick={onReset}
          >
            Annuler
          </Button>
        </div>
      </div>
      {errorMessage && <p id='text-input-error-desc-error' className='fr-error-text'>{errorMessage}</p>}
    </div>
  )
}

PerimetreForm.propTypes = {
  perimetres: PropTypes.array.isRequired,
  updatingPerimetreIdx: PropTypes.number,
  isEditing: PropTypes.bool.isRequired,
  handlePerimetres: PropTypes.func.isRequired,
  handleUpdatingPerimetreIdx: PropTypes.func.isRequired,
  handleAdding: PropTypes.func.isRequired,
  handleEditing: PropTypes.func.isRequired,
  onRequiredFormOpen: PropTypes.func.isRequired,
  perimetreAsObject: PropTypes.func.isRequired
}

PerimetreForm.defaultProps = {
  updatingPerimetreIdx: null
}

export default PerimetreForm
