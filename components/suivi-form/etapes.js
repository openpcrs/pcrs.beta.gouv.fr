/* eslint-disable camelcase */
import PropTypes from 'prop-types'
import {findIndex} from 'lodash-es'

import colors from '@/styles/colors.js'

import {useInput} from '@/hooks/input.js'

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

const Etapes = ({initialValue, etapes, handleEtapes}) => {
  const {statut, date_debut} = initialValue

  const [statutInput, setStatutInput] = useInput({initialValue: statut})
  const [startDate, setStartDate] = useInput({initialValue: date_debut})

  const handleDateChange = (value, statut) => {
    if (statut === statutInput) {
      setStartDate(value)
    }

    handleEtapes(prevEtapes => {
      const etapesCopy = [...prevEtapes]
      etapesCopy[etapesCopy.findIndex(e => e.statut === statut)] = {statut, date_debut: value}
      return etapesCopy
    })
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
      <hr className='separator fr-my-3w' />

      {etapes.map((etape, index) => {
        const findLabel = STATUS.find(status => etape.statut === status.value).label

        return (
          <div key={etape.statut} className='fr-grid-row fr-my-5w'>
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
            <div className='fr-grid-row fr-grid-row--bottom fr-pl-2w fr-col-1 fr-pb-1w'>
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

      {Boolean(startDate || (startDate && statutInput !== 'obsolete')) && (
        <Button
          label='Ajouter une étape'
          icon='add-circle-fill'
          iconSide='left'
          onClick={addStep}
        >
          Ajouter l’étape suivante
        </Button>
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

        hr {
          border-top: 3px solid ${colors.grey850};
        }
      `}</style>
    </div>
  )
}

Etapes.propTypes = {
  etapes: PropTypes.array.isRequired,
  handleEtapes: PropTypes.func.isRequired,
  initialValue: PropTypes.shape({
    statut: PropTypes.string.isRequired,
    date_debut: PropTypes.string
  }).isRequired
}

export default Etapes
