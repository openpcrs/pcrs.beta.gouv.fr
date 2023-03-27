/* eslint-disable camelcase */
import {useState} from 'react'
import PropTypes from 'prop-types'
import {findIndex} from 'lodash-es'

import colors from '@/styles/colors.js'

import DateInput from '@/components/date-input.js'
import TextInput from '@/components/text-input.js'
import Button from '@/components/button.js'

const STATUS = [
  {label: 'Investigation', value: 'investigation'},
  {label: 'Production', value: 'production'},
  {label: 'Produit', value: 'produit'},
  {label: 'Livré', value: 'livre'},
  {label: 'Obsolète', value: 'obsolete'}
]

const Etapes = ({etapes, handleEtapes}) => {
  const [statutInput, setStatutInput] = useState('investigation')
  const [startDate, setStartDate] = useState('')

  const handleDateChange = (value, statut) => {
    if (statut === statutInput) {
      setStartDate(value)
    }

    handleEtapes([...etapes].map(etape => {
      if (etape.statut === statut) {
        etape = {
          statut,
          date_debut: value
        }
      }

      return etape
    }))
  }

  const addStep = () => {
    if (startDate) {
      const currentStepIndex = findIndex(STATUS, o => o.value === statutInput)
      const nextStepIndex = findIndex(STATUS, o => o.value === statutInput) + 1

      etapes[currentStepIndex].date_debut = startDate

      handleEtapes([...etapes, {statut: STATUS[nextStepIndex].value, date_debut: ''}])

      setStatutInput(STATUS[nextStepIndex].value)
      setStartDate('')
    }
  }

  const onDelete = (etape, index) => {
    handleEtapes(current => current.filter(c => c.statut !== etape.statut))
    setStatutInput(etapes[index - 1].statut)
    setStartDate(etapes[index - 1].date_debut)
  }

  return (
    <div className='fr-mt-8w'>
      <h3 className='fr-h5'>Étapes</h3>
      <Button
        label='Ajouter une étape'
        icon='add-circle-fill'
        iconSide='left'
        isDisabled={statutInput === 'obsolete' || !startDate}
        onClick={addStep}
      >
        Ajouter l’étape suivante
      </Button>

      {etapes.map((etape, index) => {
        const findLabel = STATUS.find(status => etape.statut === status.value).label

        return (
          <div key={etape.statut} className='fr-grid-row fr-mt-4w'>
            <div className='fr-grid-row fr-col-11'>
              <div className='fr-col-12 fr-col-md-6'>
                <TextInput
                  isRequired
                  isDisabled
                  id={etape.statut}
                  label='Statut'
                  ariaLabel='statut du projet'
                  description='Statut du projet'
                  value={findLabel}
                />
              </div>

              <div className='fr-col-12 fr-mt-3w fr-mt-md-0 fr-col-md-6 fr-pl-md-3w'>
                <DateInput
                  isRequired
                  label='Date de début'
                  ariaLabel='date de commencement du statut'
                  description='Date de début du statut'
                  value={etape.statut === statutInput ? startDate : etape.date_debut}
                  onValueChange={e => handleDateChange(e.target.value, etape.statut)}
                />
              </div>
            </div>
            <div className='fr-grid-row fr-grid-row--bottom fr-pl-2w fr-col-1'>
              <button
                type='button'
                aria-label='Supprimer l’étape'
                className='delete-button fr-p-0'
                disabled={etape.statut !== statutInput || etape.statut === 'investigation'}
                onClick={() => onDelete(etape, index)}
              >
                <span className='fr-icon-delete-line' aria-hidden='true' />
              </button>
            </div>
          </div>
        )
      }
      )}

      <style jsx>{`
        .delete-button {
          text-decoration: underline;
          width: fit-content;
          color: ${colors.error425};
        }

        button:disabled {
          color: ${colors.grey850};
        }
      `}</style>
    </div>
  )
}

Etapes.propTypes = {
  etapes: PropTypes.array.isRequired,
  handleEtapes: PropTypes.func.isRequired
}

export default Etapes