import {useCallback, useState} from 'react'
import PropTypes from 'prop-types'
import ReutilisationForm from '@/components/suivi-form/reutilisations/reutilisation-form.js'
import ReutilisationCard from '@/components/suivi-form/reutilisations/reutilisation-card.js'
import Button from '@/components/button.js'

import colors from '@/styles/colors.js'

const Reutilisations = ({reutilisations, handleReutilisations, editCode, projectId}) => {
  const [editedReutilisation, setEditedReutilisation] = useState(null)

  const handleReutilisation = useCallback(reutilisation => {
    if (editedReutilisation && editedReutilisation.index >= 0) {
      handleReutilisations(prevReutilisations => {
        const reutilisationsCopy = [...prevReutilisations]
        reutilisationsCopy[editedReutilisation.index] = reutilisation
        return reutilisationsCopy
      })
    } else {
      handleReutilisations([...reutilisations, reutilisation])
    }

    setEditedReutilisation(null)
  }, [editedReutilisation, reutilisations, handleReutilisations])

  const isReutilisationExists = useCallback(lien => {
    const _reutilisations = (editedReutilisation?.index === undefined)
      ? reutilisations
      : reutilisations.filter((a, idx) => idx !== editedReutilisation.index)

    return _reutilisations.some(reutilisation => lien.toLowerCase() === reutilisation.lien.toLowerCase())
  }, [editedReutilisation, reutilisations])

  const onDelete = async index => {
    // Check if the reutilisation has an image and delete it
    if (reutilisations[index].imageKey) {
      try {
        await fetch(`/image-upload/${reutilisations[index].imageKey}?projectId=${projectId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Token ${editCode}`
          }
        })
      } catch (error) {
        throw new Error(error.message)
      }
    }

    handleReutilisations(current => current.filter((_, i) => index !== i))
    setEditedReutilisation(null)
  }

  return (
    <>
      <div className='fr-mt-8w'>
        <h3 className='fr-h5'>Réutilisations</h3>
        <hr className='fr-my-3w' />
        {reutilisations.map((reutilisation, index) => (
          <div key={reutilisation.lien}>
            {editedReutilisation && editedReutilisation.index === index ? (
              <ReutilisationForm
                projectId={projectId}
                editCode={editCode}
                initialValues={reutilisation}
                isReutilisationExists={isReutilisationExists}
                onSubmit={handleReutilisation}
                onCancel={() => setEditedReutilisation(null)}
              />
            ) : (
              <ReutilisationCard
                {...reutilisation}
                isDisabled={Boolean(editedReutilisation)}
                handleEdition={() => setEditedReutilisation({index, reutilisation})}
                handleDelete={() => onDelete(index)}
              />
            )}
          </div>
        ))}

        {editedReutilisation && editedReutilisation.index === undefined && (
          <ReutilisationForm
            projectId={projectId}
            editCode={editCode}
            initialValues={editedReutilisation.reutilisation}
            isReutilisationExists={isReutilisationExists}
            onSubmit={handleReutilisation}
            onCancel={() => setEditedReutilisation(null)}
          />
        )}

        <div className='fr-grid-row fr-mt-3w'>
          <Button
            label='Ajouter une réutilisation'
            icon='add-circle-fill'
            onClick={() => setEditedReutilisation({})}
          >
            Ajouter une réutilisation
          </Button>
        </div>
      </div>
      <style jsx>{`
        hr {
          border-top: 3px solid ${colors.grey850};
        }
      `}</style>
    </>
  )
}

Reutilisations.propTypes = {
  reutilisations: PropTypes.array,
  handleReutilisations: PropTypes.func,
  editCode: PropTypes.string,
  projectId: PropTypes.string
}

export default Reutilisations
