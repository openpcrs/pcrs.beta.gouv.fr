import {useState} from 'react'
import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

import Perimetre from '@/components/suivi-form/perimetres/perimetre.js'
import PerimetreForm from '@/components/suivi-form/perimetres/perimetre-form.js'
import Button from '@/components/button.js'

const Perimetres = ({perimetres, hasMissingData, handlePerimetres, onRequiredFormOpen}) => {
  const [isAdding, setIsAdding] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [updatingPerimetreIndex, setUpdatingPerimetreIndex] = useState()

  const isFormOpen = isAdding || isEditing

  const onDelete = index => {
    handlePerimetres(current => current.filter((_, i) => index !== i))
    setIsAdding(false)
    setIsEditing(false)
  }

  const perimetreAsObject = perimetre => {
    const perimetreAsArray = perimetre.split(':')
    const perimetreType = perimetreAsArray[0]
    const perimetreCode = perimetreAsArray[1]

    return {perimetreType, perimetreCode}
  }

  return (
    <div className='fr-mt-8w'>
      <h3 className='fr-h5 fr-m-0'>Périmètres *</h3>
      <hr className='fr-my-3w' />

      {(hasMissingData && perimetres.length === 0) && (
        <div className='fr-error-text fr-mt-1w'>Au moins un périmètre doit être ajouté</div>
      )}

      <div className='fr-notice fr-notice--info'>
        <div className='fr-mx-2w fr-notice__body'>
          <p>les référentiels INSEE les plus à jour qui ne tiennent pas compte des territoires fusionnés il y a plus d’un an </p>
        </div>
      </div>

      <div className='fr-grid-row fr-mt-2w'>
        {perimetres.map((perimetre, idx) => (
          <div key={perimetre} className={updatingPerimetreIndex === idx ? 'fr-col-12' : ''}>
            <Perimetre
              perimetre={perimetre}
              perimetreAsObject={perimetreAsObject(perimetre)}
              isFormOpen={isFormOpen}
              handleUpdate={() => {
                setIsEditing(true)
                setUpdatingPerimetreIndex(idx)
              }}
              handleDelete={() => onDelete(idx)}
            />

            {updatingPerimetreIndex === idx && (
              <div>
                <PerimetreForm
                  perimetreAsObject={perimetreAsObject}
                  updatingPerimetreIdx={updatingPerimetreIndex}
                  handleUpdatingPerimetreIdx={setUpdatingPerimetreIndex}
                  handleAdding={setIsAdding}
                  handleEditing={setIsEditing}
                  perimetres={perimetres}
                  handlePerimetres={handlePerimetres}
                  isEditing={isEditing}
                  onRequiredFormOpen={onRequiredFormOpen}
                />

                <hr className='edit-separator fr-my-3w' />
              </div>
            )}
          </div>
        )
        )}
      </div>

      {isAdding && (
        <PerimetreForm
          perimetreAsObject={perimetreAsObject}
          updatingPerimetreIdx={updatingPerimetreIndex}
          handleUpdatingPerimetreIdx={setUpdatingPerimetreIndex}
          handleAdding={setIsAdding}
          handleEditing={setIsEditing}
          perimetres={perimetres}
          handlePerimetres={handlePerimetres}
          isEditing={isEditing}
          onRequiredFormOpen={onRequiredFormOpen}
        />
      )}

      {!isAdding && !isEditing && (
        <div className='fr-mt-3w'>
          <Button
            label='Ajouter un périmètre'
            icon='add-circle-fill'
            iconSide='left'
            onClick={() => {
              onRequiredFormOpen(true)
              setIsAdding(true)
            }}
          >
            Ajouter un périmètre
          </Button>
        </div>
      )}

      <style jsx>{`
        .editing-perimetre {
          flex: 1;
        }

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

Perimetres.propTypes = {
  perimetres: PropTypes.array.isRequired,
  hasMissingData: PropTypes.bool,
  handlePerimetres: PropTypes.func.isRequired,
  onRequiredFormOpen: PropTypes.func.isRequired
}

Perimetres.defaultProps = {
  hasMissingData: false
}
export default Perimetres
