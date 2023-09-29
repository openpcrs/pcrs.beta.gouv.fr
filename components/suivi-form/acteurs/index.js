import {useState, useMemo} from 'react'
import PropTypes from 'prop-types'
import {orderBy} from 'lodash-es'

import colors from '@/styles/colors.js'

import Button from '@/components/button.js'
import ActeurCard from '@/components/suivi-form/acteurs/acteur-card.js'
import ActeurForm from '@/components/suivi-form/acteurs/acteur-form.js'

const Acteurs = ({acteurs, handleActors}) => {
  const [isAdding, setIsAdding] = useState(false)
  const [updatingActorIndex, setUpdatingActorIndex] = useState(null)

  const sortActorsByAplc = useMemo(() => orderBy(acteurs, a => a.role === 'porteur' || 'aplc', ['desc']), [acteurs])

  const onDelete = siren => {
    handleActors(current => current.filter(c => c.siren !== siren))
    setIsAdding(false)
  }

  const handleActor = actor => {
    if (updatingActorIndex || updatingActorIndex === 0) {
      handleActors(prevActeurs => {
        const acteursCopy = [...prevActeurs]
        acteursCopy[updatingActorIndex] = actor
        return acteursCopy
      })
    } else {
      handleActors([...acteurs, actor])
    }
  }

  return (
    <div className='fr-mt-8w fr-grid-row'>
      <h3 className='fr-h5 fr-m-0 fr-col-12'>Acteurs *</h3>
      <hr className='fr-my-3w fr-col-12' />

      <div className='fr-grid-row fr-col-12'>
        {sortActorsByAplc.map((actor, idx) => (
          <div key={actor.siren} className='fr-col-12 fr-mb-7w fr-p-0'>
            <ActeurCard
              isFormOpen={isAdding || updatingActorIndex === idx}
              handleEdition={() => setUpdatingActorIndex(idx)}
              handleDelete={() => onDelete(actor.siren)}
              {...actor}
            />

            {updatingActorIndex === idx && (
              <div>
                <ActeurForm
                  acteurs={acteurs}
                  updatingActorIndex={updatingActorIndex}
                  handleActor={handleActor}
                  handleActorIndex={setUpdatingActorIndex}
                  handleAdding={setIsAdding}
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
          handleActor={handleActor}
          handleActorIndex={setUpdatingActorIndex}
          handleAdding={setIsAdding}
        />
      )}

      {!isAdding && !updatingActorIndex && (
        <div className='fr-mt-3w fr-col-12'>
          <Button
            label='Ajouter un acteur'
            icon='add-circle-fill'
            iconSide='left'
            onClick={() => setIsAdding(true)}
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
  handleActors: PropTypes.func.isRequired
}

export default Acteurs
