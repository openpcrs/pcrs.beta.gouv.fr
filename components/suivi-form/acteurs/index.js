import {useState, useMemo} from 'react'
import PropTypes from 'prop-types'
import {orderBy} from 'lodash-es'

import colors from '@/styles/colors.js'

import Button from '@/components/button.js'
import ActeurCard from '@/components/suivi-form/acteurs/acteur-card.js'
import ActeurForm from '@/components/suivi-form/acteurs/acteur-form.js'

const Acteurs = ({acteurs, handleActors, hasMissingData, onRequiredFormOpen}) => {
  const [isAdding, setIsAdding] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [updatingActorIndex, setUpdatingActorIndex] = useState(null)

  const onDelete = siren => {
    handleActors(current => current.filter(c => c.siren !== siren))
    setIsAdding(false)
    setIsEditing(false)
  }

  const sortActorsByAplc = useMemo(() => orderBy(acteurs, a => a.role === 'porteur' || 'aplc', ['desc']), [acteurs])

  return (
    <div className='fr-mt-8w fr-grid-row'>
      <h3 className='fr-h5 fr-m-0 fr-col-12'>Acteurs *</h3>
      <hr className='fr-my-3w fr-col-12' />

      {(hasMissingData && acteurs.length === 0) && (
        <div className='fr-error-text fr-mt-1w fr-col-12'>Au moins un acteur doit être ajouté</div>
      )}

      <div className='fr-grid-row fr-col-12'>
        {sortActorsByAplc.map((actor, idx) => (
          <div key={actor.siren} className='fr-col-12 fr-mb-7w fr-p-0'>
            <ActeurCard
              handleActors={handleActors}
              isFormOpen={isAdding || isEditing}
              handleEdition={() => {
                setUpdatingActorIndex(idx)
                setIsEditing(true)
              }}
              handleDelete={() => onDelete(actor.siren)}
              {...actor}
            />

            {updatingActorIndex === idx && (
              <div>
                <ActeurForm
                  acteurs={acteurs}
                  updatingActorIndex={updatingActorIndex}
                  isAdding={isAdding}
                  isEditing={isEditing}
                  handleActors={handleActors}
                  handleActorIndex={setUpdatingActorIndex}
                  handleAdding={setIsAdding}
                  handleEditing={setIsEditing}
                  onRequiredFormOpen={onRequiredFormOpen}
                />
                <hr className='edit-separator fr-my-3w' />
              </div>
            )}
          </div>
        ))}
      </div>

      {isAdding && (
        <ActeurForm
          acteurs={acteurs}
          updatingActorIndex={updatingActorIndex}
          isAdding={isAdding}
          isEditing={isEditing}
          handleActors={handleActors}
          handleActorIndex={setUpdatingActorIndex}
          handleAdding={setIsAdding}
          handleEditing={setIsEditing}
          onRequiredFormOpen={onRequiredFormOpen}
        />
      )}

      {!isAdding && !isEditing && (
        <div className='fr-mt-3w fr-col-12'>
          <Button
            label='Ajouter un acteur'
            icon='add-circle-fill'
            iconSide='left'
            onClick={() => {
              setIsAdding(true)
              onRequiredFormOpen(true)
            }}
          >
            Ajouter un acteur
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

Acteurs.propTypes = {
  acteurs: PropTypes.array.isRequired,
  hasMissingData: PropTypes.bool,
  handleActors: PropTypes.func.isRequired,
  onRequiredFormOpen: PropTypes.func.isRequired
}

Acteurs.defaultProps = {
  hasMissingData: false
}

export default Acteurs
