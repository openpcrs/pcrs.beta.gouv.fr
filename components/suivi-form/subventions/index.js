import {useCallback, useState} from 'react'
import PropTypes from 'prop-types'
import {uniqueId} from 'lodash-es'

import colors from '@/styles/colors.js'

import {normalizeSring} from '@/lib/string.js'

import SubventionCard from '@/components/suivi-form/subventions/subvention-card.js'
import SubventionForm from '@/components/suivi-form/subventions/subvention-form.js'
import Button from '@/components/button.js'

const Subventions = ({subventions, handleSubventions}) => {
  const [editedSubvention, setEditedSubvention] = useState(null)

  const onDelete = index => {
    handleSubventions(current => current.filter((_, i) => index !== i))
    setEditedSubvention(null)
  }

  const handleSubvention = useCallback(subvention => {
    if (editedSubvention && editedSubvention.index >= 0) {
      handleSubventions(prevSubventions => {
        const subventionsCopy = [...prevSubventions]
        subventionsCopy[editedSubvention.index] = subvention
        return subventionsCopy
      })
    } else {
      handleSubventions([...subventions, subvention])
    }

    setEditedSubvention(null)
  }, [editedSubvention, subventions, handleSubventions])

  const isSubventionExisting = useCallback(nom => {
    const _subventions = (typeof editedSubvention?.index === 'undefined')
      ? subventions
      : subventions.filter((a, idx) => idx !== editedSubvention.index) // Filter subvention being edited
    return _subventions.some(subvention => normalizeSring(nom) === normalizeSring(subvention.nom))
  }, [editedSubvention, subventions])

  return (
    <div className='fr-mt-8w'>
      <h3 className='fr-h5'>Subventions</h3>
      <hr className='fr-my-3w' />

      {subventions.map((subvention, index) => (
        <div key={uniqueId()}>
          {editedSubvention && editedSubvention.index === index ? (
            <div>
              <SubventionForm
                initialValues={editedSubvention.subvention}
                isSubventionExisting={isSubventionExisting}
                onCancel={() => setEditedSubvention(null)}
                onSubmit={handleSubvention}
              />
              <hr className='edit-separator fr-my-3w' />
            </div>
          ) : (
            <SubventionCard
              {...subvention}
              isDisabled={Boolean(editedSubvention)}
              handleSubventions={handleSubventions}
              handleEdition={() => setEditedSubvention({subvention, index})}
              handleDelete={() => onDelete(index)}
            />
          )}
        </div>
      ))}

      {editedSubvention && !editedSubvention.index && (
        <SubventionForm
          initialValues={editedSubvention}
          isSubventionExisting={isSubventionExisting}
          onCancel={() => setEditedSubvention(null)}
          onSubmit={handleSubvention}
        />
      )}

      {!editedSubvention && (
        <Button
          label='Ajouter une subvention'
          icon='add-circle-fill'
          iconSide='left'
          onClick={() => setEditedSubvention({})}
        >
          Ajouter une subvention
        </Button>
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

Subventions.propTypes = {
  subventions: PropTypes.array.isRequired,
  handleSubventions: PropTypes.func.isRequired
}

export default Subventions
