import {useState} from 'react'
import PropTypes from 'prop-types'
import {uniqueId} from 'lodash-es'

import colors from '@/styles/colors.js'

import Button from '@/components/button.js'
import LivrableCard from '@/components/suivi-form/livrables/livrable-card.js'
import LivrableForm from '@/components/suivi-form/livrables/livrable-form.js'

const Livrables = ({livrables, hasMissingData, handleLivrables, onRequiredFormOpen}) => {
  const [isAdding, setIsAdding] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [updatingLivrableIndex, setUpdatingLivrableIndex] = useState()

  const onDelete = index => {
    handleLivrables(current => current.filter((_, i) => index !== i))
    setIsAdding(false)
    setIsEditing(false)
  }

  return (
    <div className='fr-mt-8w fr-grid-row'>
      <h3 className='fr-h5 fr-m-0 fr-col-12'>Livrables *</h3>
      <hr className='fr-my-3w fr-col-12' />

      {(hasMissingData && livrables.length === 0) && (
        <div className='fr-error-text fr-mt-1w fr-col-12'>Au moins un livrable doit être ajouté</div>
      )}

      <div className='fr-grid-row fr-col-12'>
        {livrables.map((livrable, idx) => (
          <div key={uniqueId()} className='fr-col-12 fr-mb-7w fr-p-0'>
            <LivrableCard
              {...livrable}
              isDisabled={isAdding || isEditing}
              handleEdition={() => {
                setUpdatingLivrableIndex(idx)
                setIsEditing(true)
              }}
              handleDelete={() => onDelete(idx)}
            />

            {updatingLivrableIndex === idx && (
              <div>
                <LivrableForm
                  livrables={livrables}
                  updatingLivrableIdx={updatingLivrableIndex}
                  isAdding={isAdding}
                  isEditing={isEditing}
                  handleUpdatingLivrableIdx={setUpdatingLivrableIndex}
                  handleLivrables={handleLivrables}
                  handleAdding={setIsAdding}
                  handleEditing={setIsEditing}
                  onRequiredFormOpen={onRequiredFormOpen}
                />
                <div className='edit-separator fr-my-3w' />
              </div>
            )}
          </div>
        ))}
      </div>

      {isAdding && (
        <LivrableForm
          livrables={livrables}
          updatingLivrableIdx={updatingLivrableIndex}
          isAdding={isAdding}
          isEditing={isEditing}
          handleUpdatingLivrableIdx={setUpdatingLivrableIndex}
          handleLivrables={handleLivrables}
          handleAdding={setIsAdding}
          handleEditing={setIsEditing}
          onRequiredFormOpen={onRequiredFormOpen}
        />
      )}

      {!isAdding && !isEditing && (
        <div className='fr-mt-3w fr-col-12'>
          <Button
            label='Ajouter un livrable'
            icon='add-circle-fill'
            iconSide='left'
            onClick={() => {
              onRequiredFormOpen(true)
              setIsAdding(true)
            }}
          >
            Ajouter un livrable
          </Button>
        </div>
      )}

      <style jsx>{`
        hr {
          border-top: 3px solid ${colors.grey850};
        }

        .edit-separator {
          border-top: 2px solid ${colors.blueFrance850};
        }
      `}</style>
    </div>
  )
}

Livrables.propTypes = {
  livrables: PropTypes.array.isRequired,
  hasMissingData: PropTypes.bool,
  handleLivrables: PropTypes.func.isRequired,
  onRequiredFormOpen: PropTypes.func.isRequired
}

Livrables.defaultProps = {
  hasMissingData: false
}

export default Livrables
