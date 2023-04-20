import {useState} from 'react'
import PropTypes from 'prop-types'
import {uniqueId} from 'lodash-es'

import colors from '@/styles/colors.js'

import SubventionCard from '@/components/suivi-form/subventions/subvention-card.js'
import SubventionForm from '@/components/suivi-form/subventions/subvention-form.js'
import Button from '@/components/button.js'

const Subventions = ({subventions, handleSubventions}) => {
  const [isAdding, setIsAdding] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [updatingSubvIndex, setUpdatingSubvIndex] = useState(null)

  const onDelete = index => {
    handleSubventions(current => current.filter((_, i) => index !== i))
    setIsAdding(false)
    setIsEditing(false)
  }

  return (
    <div className='fr-mt-8w'>
      <h3 className='fr-h5'>Subventions</h3>

      {(subventions.length > 0 || isAdding || isEditing) && <div className='separator fr-my-3w' />}

      {subventions.map((subvention, idx) => (
        <div key={uniqueId()}>
          <SubventionCard
            handleSubventions={handleSubventions}
            handleEdition={() => {
              setUpdatingSubvIndex(idx)
              setIsEditing(true)
            }}
            handleDelete={() => onDelete(idx)}
            {...subvention}
          />

          {updatingSubvIndex === idx && (
            <div>
              <SubventionForm
                subventions={subventions}
                handleSubventions={handleSubventions}
                updatingSubvIdx={updatingSubvIndex}
                isEditing={isEditing}
                isAdding={isAdding}
                handleEditing={setIsEditing}
                handleAdding={setIsAdding}
                handleUpdatingSubvIdx={setUpdatingSubvIndex}
              />
              <div className='edit-separator fr-my-3w' />
            </div>
          )}
        </div>
      ))}

      {isAdding && (
        <SubventionForm
          subventions={subventions}
          handleSubventions={handleSubventions}
          updatingSubvIdx={updatingSubvIndex}
          isEditing={isEditing}
          isAdding={isAdding}
          handleEditing={setIsEditing}
          handleAdding={setIsAdding}
          handleUpdatingSubvIdx={setUpdatingSubvIndex}
        />
      )}

      {!isAdding && !isEditing && (
        <Button
          label='Ajouter une subvention'
          icon='add-circle-fill'
          iconSide='left'
          onClick={() => setIsAdding(true)}
        >
          Ajouter une subvention
        </Button>
      )}

      <style jsx>{`
        .separator {
          border-top: 3px solid ${colors.grey850};
        }

        .edit-separator {
          border-top: 2px solid ${colors.blueFrance850};
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
