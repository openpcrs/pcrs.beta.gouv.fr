import {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'

import {natureOptions} from '@/components/suivi-form/subventions/utils/select-options.js'

import TextInput from '@/components/text-input.js'
import SelectInput from '@/components/select-input.js'
import NumberInput from '@/components/number-input.js'
import DateInput from '@/components/date-input.js'
import Button from '@/components/button.js'

const SubventionForm = ({subventions, updatingSubvIdx, isEditing, handleSubventions, handleEditing, handleAdding, handleUpdatingSubvIdx}) => {
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

  const handleSubmit = () => {
    if (montant && montant < 0) {
      return setErrorMessage('Veuillez entrer des valeurs supérieures à 0 dans les champs de financement')
    }

    if (!hasInvalidInput) {
      const checkIsExisting = () => {
        if (isEditing) {
          return subventions.some(subvention => subvention.nom === nom) && nom !== updatingName
        }

        return subventions.some(subvention => subvention.nom === nom)
      }

      if (!nom || !nature) {
        setHasMissingInput(true)
      } else if (checkIsExisting()) {
        setErrorMessage('Cette subvention existe déjà')
      } else {
        const newSubvention = {
          nom,
          nature,
          montant: Number(montant) || null,
          echeance: echeance ? echeance : null
        }
        if (isEditing) {
          handleSubventions(prevSubventions => {
            const subventionsCopy = [...prevSubventions]
            subventionsCopy[updatingSubvIdx] = newSubvention
            return subventionsCopy
          })
        } else {
          handleSubventions([...subventions, newSubvention])
        }

        onReset()
      }
    }
  }

  const onReset = () => {
    handleAdding(false)
    handleEditing(false)
    setHasMissingInput(false)
    handleUpdatingSubvIdx(null)
    setSubvention({
      nom: '',
      nature: '',
      montant: '',
      echeance: ''
    })
    setUpdatingName(null)
    setErrorMessage(null)
  }

  const handleErrors = useCallback(input => {
    if (!input && hasMissingInput) {
      return 'Ce champs est requis'
    }
  }, [hasMissingInput])

  useEffect(() => {
    // Switch to subvention update form
    if (isEditing) {
      const subvToUpdate = subventions[updatingSubvIdx]

      setSubvention({
        nom: subvToUpdate.nom,
        nature: subvToUpdate.nature,
        montant: subvToUpdate.montant || '',
        echeance: subvToUpdate.echeance || ''
      })

      setUpdatingName(subvToUpdate.nom)
    }
  }, [isEditing, subventions, updatingSubvIdx])

  return (
    <div>
      <div className='fr-grid-row fr-my-5w'>
        <div className='fr-grid-row fr-col-12 fr-pr-3w'>
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
          <div className='fr-col-12 fr-col-lg-4 fr-pr-3w fr-mt-3w fr-mt-lg-0'>
            <SelectInput
              isRequired
              options={natureOptions}
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

          <div className='fr-col-12 fr-col-lg-4 fr-pr-3w fr-mt-3w fr-mt-lg-0'>
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

          <div className='fr-col-12 fr-col-lg-4 fr-pr-3w fr-mt-3w fr-mt-lg-0'>
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
          onClick={handleSubmit}
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
  )
}

SubventionForm.propTypes = {
  subventions: PropTypes.array,
  updatingSubvIdx: PropTypes.number,
  isEditing: PropTypes.bool.isRequired,
  handleSubventions: PropTypes.func.isRequired,
  handleEditing: PropTypes.func.isRequired,
  handleAdding: PropTypes.func.isRequired,
  handleUpdatingSubvIdx: PropTypes.func.isRequired
}

SubventionForm.defaultProps = {
  updatingSubvIdx: null,
  subventions: []
}

export default SubventionForm
