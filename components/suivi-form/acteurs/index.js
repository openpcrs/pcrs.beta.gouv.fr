import {useState, useMemo, useCallback} from 'react'
import PropTypes from 'prop-types'
import {orderBy} from 'lodash-es'

import colors from '@/styles/colors.js'

import Button from '@/components/button.js'
import ActeurCard from '@/components/suivi-form/acteurs/acteur-card.js'
import ActeurForm from '@/components/suivi-form/acteurs/acteur-form.js'

const Acteurs = ({acteurs, handleActors}) => {
  const [editedActor, setEditedActor] = useState(acteurs?.length > 0 ? null : {})

  const sortActorsByAplc = useMemo(() => orderBy(acteurs, a => a.role === 'porteur' || 'aplc', ['desc']), [acteurs])
  const hasAplc = useMemo(() => acteurs.some(actor => actor.role === 'aplc' || actor.role === 'porteur'), [acteurs])

  const onDelete = siren => {
    handleActors(current => current.filter(c => c.siren !== siren))
    setEditedActor(null)
  }

  const handleActor = useCallback(actor => {
    if (editedActor && editedActor.index >= 0) {
      handleActors(prevActeurs => {
        const acteursCopy = [...prevActeurs]
        acteursCopy[editedActor.index] = actor
        return acteursCopy
      })
    } else {
      handleActors([...acteurs, actor])
    }

    setEditedActor(null)
  }, [editedActor, acteurs, handleActors])

  const isSirenAlreadyUsed = useCallback(siren => {
    const actors = (editedActor?.index === undefined) // Check if index is defined
      ? acteurs
      : acteurs.filter((a, idx) => idx !== editedActor.index) // Filter actor being edited
    return actors.some(acteur => siren === acteur.siren.toString())
  }, [editedActor, acteurs])

  return (
    <div className='fr-mt-8w fr-grid-row'>
      <h3 className='fr-h5 fr-m-0 fr-col-12'>Acteurs *</h3>
      <hr className='fr-my-3w fr-col-12' />

      <div className='fr-grid-row fr-col-12'>
        {sortActorsByAplc.map((actor, index) => (
          <div key={actor.siren} className='fr-col-12 fr-mb-7w fr-p-0'>

            {editedActor && editedActor.index === index ? (
              <ActeurForm
                initialValues={editedActor.actor}
                isAplcDisabled={hasAplc}
                isSirenAlreadyUsed={isSirenAlreadyUsed}
                onCancel={() => setEditedActor(null)}
                onSubmit={handleActor}
              />
            ) : (
              <ActeurCard
                actor={actor}
                isDisabled={Boolean(editedActor)}
                handleEdition={() => setEditedActor({actor, index})}
                handleDelete={() => onDelete(actor.siren)}
              />
            )}
          </div>
        ))}
      </div>

      {(acteurs.length === 0 || (editedActor && editedActor.index === undefined)) && (
        <ActeurForm
          initialValues={{}}
          isAplcDisabled={hasAplc}
          isSirenAlreadyUsed={isSirenAlreadyUsed}
          onCancel={acteurs.length > 0 ? () => setEditedActor(null) : null}
          onSubmit={handleActor}
        />
      )}

      {(!editedActor && acteurs.length > 0) && (
        <div className='fr-mt-3w fr-col-12'>
          <Button
            label='Ajouter un acteur'
            icon='add-circle-fill'
            iconSide='left'
            onClick={() => setEditedActor({actor: {}})}
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
