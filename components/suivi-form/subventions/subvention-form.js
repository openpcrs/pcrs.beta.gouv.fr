import {useState, useCallback, useEffect, useMemo} from 'react'
import PropTypes from 'prop-types'

import {useInput} from '@/hooks/input.js'

import {natureOptions} from '@/components/suivi-form/subventions/utils/select-options.js'

import TextInput from '@/components/text-input.js'
import SelectInput from '@/components/select-input.js'
import DateInput from '@/components/date-input.js'
import Button from '@/components/button.js'
import NumberInput from '@/components/number-input.js'

const SubventionForm = ({subventions, updatingSubvIdx, isEditing, handleSubventions, handleEditing, handleAdding, handleUpdatingSubvIdx}) => {
  const [isFormComplete, setIsFormComplete] = useState(true)
  const [errorMessage, setErrorMessage] = useState()
  const [updatingName, setUpdatingName] = useState()

  const [nom, setNom, nomError] = useInput({isRequired: !isFormComplete})
  const [nature, setNature, natureError] = useInput({isRequired: !isFormComplete})
  const [montant, setMontant, montantError, handleMontantValidity, isMontantInputValid] = useInput({})
  const [echeance, setEcheance] = useInput({})

  const isCompleteOnSubmit = Boolean(nom && nature)

  useEffect(() => {
    if (isCompleteOnSubmit && isMontantInputValid) {
      setErrorMessage(null)
    }
  }, [isCompleteOnSubmit, isMontantInputValid])

  const isSubventionExisting = useMemo(() => {
    if (isEditing) {
      return subventions.some(subvention => subvention.nom === nom) && nom !== updatingName
    }

    return subventions.some(subvention => subvention.nom === nom)
  }, [subventions, updatingName, nom, isEditing])

  const handleSubmit = () => {
    setErrorMessage(null)

    if (isCompleteOnSubmit) {
      if (isMontantInputValid) {
        if (!nom || !nature) {
          setIsFormComplete(false)
        } else if (isSubventionExisting) {
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
      } else {
        setErrorMessage('Veuillez modifier les champs invalides')
      }
    } else {
      setIsFormComplete(false)
      setErrorMessage('Veuillez compléter les champs requis manquants')
    }
  }

  const onReset = useCallback(() => {
    handleAdding(false)
    handleEditing(false)
    setIsFormComplete(true)
    handleUpdatingSubvIdx(null)
    setUpdatingName(null)
    setErrorMessage(null)

    setNom('')
    setNature('')
    setEcheance('')
    setMontant('')
  }, [
    handleAdding,
    handleEditing,
    setIsFormComplete,
    handleUpdatingSubvIdx,
    setNom,
    setNature,
    setEcheance,
    setMontant,
    setUpdatingName,
    setErrorMessage
  ])

  useEffect(() => {
    // Switch to subvention update form
    if (isEditing) {
      const subvToUpdate = subventions[updatingSubvIdx]

      setNom(subvToUpdate.nom)
      setNature(subvToUpdate.nature)
      setEcheance(subvToUpdate.echeance || '')
      setMontant(subvToUpdate.montant.toString() || '')

      setUpdatingName(subvToUpdate.nom)
    }
  }, [isEditing, subventions, updatingSubvIdx, setNature, setNom, setEcheance, setMontant])

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
              errorMessage={nomError}
              onValueChange={e => setNom(e.target.value)}
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
              errorMessage={natureError}
              onValueChange={e => setNature(e.target.value)}
            />
          </div>

          <div className='fr-col-12 fr-col-lg-4 fr-pr-3w fr-mt-3w fr-mt-lg-0'>
            <NumberInput
              label='Montant'
              value={montant}
              ariaLabel='montant de la subvention'
              description='Montant de la subvention'
              min={0}
              errorMessage={montantError}
              setIsValueValid={handleMontantValidity}
              onValueChange={e => setMontant(e.target.value)}
            />
          </div>

          <div className='fr-col-12 fr-col-lg-4 fr-pr-3w fr-mt-3w fr-mt-lg-0'>
            <DateInput
              label='Échéance'
              value={echeance}
              ariaLabel='date d’expiration de la subvention'
              description='Date à laquelle la subvention expire'
              onValueChange={e => setEcheance(e.target.value)}
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
