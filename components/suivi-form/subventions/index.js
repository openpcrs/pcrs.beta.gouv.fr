import {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {uniqueId} from 'lodash-es'

import colors from '@/styles/colors.js'

import TextInput from '@/components/text-input.js'
import SelectInput from '@/components/select-input.js'
import NumberInput from '@/components/number-input.js'
import DateInput from '@/components/date-input.js'
import SubventionCard from '@/components/suivi-form/subventions/subvention-card.js'
import Button from '@/components/button.js'

const NATURES = [
  {value: 'feder', label: 'Financement FEDER'},
  {value: 'cepr', label: 'Contrat État-Région'},
  {value: 'detr', label: 'Dotations de l’État aux Territoires Ruraux'}
]

const Subventions = ({subventions, handleSubventions}) => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updatingSubvIndex, setUpdatingSubvIndex] = useState(null)
  const [hasMissingInput, setHasMissingInput] = useState(false)
  const [hasInvalidInput, setHasInvalidInput] = useState(false)
  const [errorMessage, setErrorMessage] = useState()

  const [subvention, setSubvention] = useState({
    nom: '',
    nature: '',
    montant: '',
    echeance: ''
  })
  const [updatingName, setUpdatingName] = useState()

  const {nom, nature, montant, echeance} = subvention

  const onReset = () => {
    setIsFormOpen(false)
    setHasMissingInput(false)

    setUpdatingSubvIndex()
    setSubvention({
      nom: '',
      nature: '',
      montant: '',
      echeance: ''
    })
    setUpdatingName()
    setErrorMessage()
    setIsUpdating(false)
  }

  const onAdd = () => {
    if (montant && montant < 0) {
      return setErrorMessage('Veuillez entrer des valeurs supérieurs à 0 dans les champs de financement')
    }

    if (!hasInvalidInput) {
      if (!nom || !nature) {
        setHasMissingInput(true)
      } else if (subventions.some(subvention => subvention.nom === nom)) {
        setErrorMessage('Cette subvention existe déjà')
      } else {
        handleSubventions([...subventions, {
          nom,
          nature,
          montant: Number(montant) || null,
          echeance: echeance ? echeance : null
        }])
        onReset()
      }
    }
  }


  const onUpdate = () => {
    if (montant && montant < 0) {
      return setErrorMessage('Veuillez entrer des valeurs supérieurs à 0 dans les champs de financement')
    }

    if (!nom || !nature) {
      setHasMissingInput(true)
    } else if (subventions.some(subvention => subvention.nom === nom) && nom !== updatingName) {
      setErrorMessage('Cette subvention existe déjà')
    } else {
      handleSubventions([...subventions].map((subvention, i) => {
        if (i === updatingSubvIndex) {
          subvention = {nom, nature, montant: Number(montant) || null, echeance: echeance ? echeance : null}
        }

        return subvention
      }))

      onReset()
    }
  }

  const onDelete = index => {
    handleSubventions(current => current.filter((_, i) => index !== i))
    onReset()
  }

  const handleErrors = useCallback(input => {
    if (!input && hasMissingInput) {
      return 'Ce champs est requis'
    }
  }, [hasMissingInput])

  useEffect(() => {
    // Switch to subvention update form
    if (isUpdating) {
      const subvToUpdate = subventions[updatingSubvIndex]

      setSubvention({
        nom: subvToUpdate.nom,
        nature: subvToUpdate.nature,
        montant: subvToUpdate.montant || '',
        echeance: subvToUpdate.echeance || ''
      })

      setUpdatingName(subvToUpdate.nom)
      setIsFormOpen(true)
    }
  }, [isUpdating, subventions, updatingSubvIndex])

  useEffect(() => {
    if (updatingSubvIndex || updatingSubvIndex === 0) {
      setIsUpdating(true)
    }
  }, [updatingSubvIndex])

  return (
    <div className='fr-mt-8w'>
      <h3 className='fr-h5'>Subventions</h3>
      <Button
        label='Ajouter une subvention'
        icon='add-circle-fill'
        iconSide='left'
        isDisabled={isFormOpen}
        onClick={() => setIsFormOpen(true)}
      >
        Ajouter une subvention
      </Button>

      {(subventions.length > 1 || isFormOpen) && <div className='separator fr-my-3w' />}

      {(isFormOpen || isUpdating) && (
        <div>
          <div className='fr-grid-row fr-my-5w'>
            <div className='fr-grid-row fr-col-12'>
              <div className='fr-col-12 fr-col-md-6'>
                <TextInput
                  isRequired
                  label='Nom'
                  value={nom}
                  ariaLabel='nom de la subvention'
                  description='Nom de la subvention'
                  errorMessage={handleErrors(nom)}
                  onValueChange={e => {
                    setSubvention({
                      ...subvention,
                      nom: e.target.value
                    })
                  }}
                />
              </div>
            </div>

            <div className='fr-grid-row fr-col-12 fr-mt-5w'>
              <div className='fr-col-12 fr-col-md-4'>
                <SelectInput
                  isRequired
                  options={NATURES}
                  label='Nature'
                  value={nature}
                  ariaLabel='nature de la subvention'
                  description='Nature de la subvention'
                  errorMessage={handleErrors(nature)}
                  onValueChange={e => {
                    setSubvention({
                      ...subvention,
                      nature: e.target.value
                    })
                  }}
                />
              </div>

              <div className='fr-col-12 fr-col-md-4 fr-px-md-3w'>
                <NumberInput
                  label='Montant'
                  value={montant.toString()}
                  min={0}
                  ariaLabel='montant de la subvention'
                  description='Montant de la subvention'
                  onIsInvalid={setHasInvalidInput}
                  onValueChange={e => {
                    setSubvention({
                      ...subvention,
                      montant: e.target.value
                    })
                  }}
                />
              </div>

              <div className='fr-col-12 fr-col-md-4'>
                <DateInput
                  label='Échéance'
                  value={echeance}
                  ariaLabel='date d’expiration de la subvention'
                  description='Date à laquelle la subvention expire'
                  onValueChange={e => {
                    setSubvention({
                      ...subvention,
                      echeance: e.target.value
                    })
                  }}
                />
              </div>
            </div>
          </div>
          <div className='fr-grid-row'>
            <Button
              label='Valider l’ajout de la subvention'
              icon='checkbox-circle-fill'
              onClick={() => isUpdating ? onUpdate() : onAdd()}
            >
              Valider
            </Button>
            <div className='fr-pl-3w'>
              <Button
                label='Annuler l’ajout de la subvention'
                buttonStyle='tertiary'
                onClick={onReset}
              >
                Annuler
              </Button>
            </div>
          </div>
          {errorMessage && <p id='text-input-error-desc-error' className='fr-error-text'>{errorMessage}</p>}
        </div>
      )}

      {subventions.map((subvention, idx) => (
        <SubventionCard
          key={uniqueId()}
          natures={NATURES}
          handleSubventions={handleSubventions}
          handleEdition={() => setUpdatingSubvIndex(idx)}
          handleDelete={() => onDelete(idx)}
          {...subvention}
        />
      ))}

      <style jsx>{`
        .separator {
          border-top: 3px solid ${colors.grey850};
        }
      `}</style>
    </div>
  )
}

Subventions.propTypes = {
  subventions: PropTypes.array.isRequired,
  handleSubventions: PropTypes.func.isRequired
}

export default Subventions
