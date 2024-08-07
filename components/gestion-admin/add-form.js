import {useState} from 'react'
import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

import TextInput from '@/components/text-input.js'
import Button from '@/components/button.js'

const AddForm = ({initialValues, editingItemId, onClose, errorMessage, isAdmin, onSubmit}) => {
  const [nom, setNom] = useState(initialValues?.nom || '')
  const [email, setEmail] = useState(initialValues?.email || '')

  const handleSubmit = event => {
    event.preventDefault()

    onSubmit(nom, email, editingItemId)
  }

  return (
    <form className='fr-grid-row fr-grid-row--gutters fr-my-6w fr-pb-4w fr-col-12' onSubmit={handleSubmit}>
      <div className='fr-grid-row fr-col-12 fr-col-md-8 fr-pr-0'>
        <div className='fr-grid-row fr-grid-row--gutters fr-col-12'>
          <div className='fr-col-12 fr-col-md-6'>
            <TextInput
              isRequired
              autoFocus
              label={`Nom ${isAdmin ? 'de l’administrateur' : 'du porteur'}`}
              ariaLabel={`Nom ${isAdmin ? 'de l’administrateur' : 'du porteur'}`}
              value={nom}
              placeholder={`Nom ${isAdmin ? 'de l’administrateur' : 'du porteur'}`}
              onValueChange={e => setNom(e.target.value)}
            />
          </div>
          <div className='fr-col-12 fr-col-md-6'>
            <TextInput
              isRequired
              type='email'
              label={`Email ${isAdmin ? 'de l’administrateur' : 'du porteur'}`}
              ariaLabel={`Email ${isAdmin ? 'de l’administrateur' : 'du porteur'}`}
              value={email}
              placeholder={`Email ${isAdmin ? 'de l’administrateur' : 'du porteur'}`}
              onValueChange={e => setEmail(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className='fr-grid-row fr-col-md-4 fr-col-12 fr-mt-2w fr-mt-md-0'>
        <div className='fr-grid-row fr-grid-row--gutters fr-grid-row--right fr-col-12 fr-pb-1w'>
          <div className='fr-grid-row fr-grid-row--bottom fr-pr-1w'>
            <Button
              label={`Annuler l’ajout ${isAdmin ? 'de l’administrateur' : 'du porteur'}`}
              buttonStyle='tertiary'
              onClick={onClose}
            >
              Annuler
            </Button>
          </div>
          <div className='fr-grid-row fr-grid-row--bottom'>
            <Button
              type='submit'
              label={`Valider l’ajout ${isAdmin ? 'de l’administrateur' : 'du porteur'}`}
              icon='checkbox-circle-fill'
            >
              Valider
            </Button>
          </div>
        </div>
      </div>
      {errorMessage && <p className='fr-error-text fr-col-12 fr-mt-0'>{errorMessage}</p>}

      <style jsx>{`
        form {
          border-bottom: 2px solid ${colors.grey900};
        }
      `}</style>
    </form>
  )
}

AddForm.propTypes = {
  editingItemId: PropTypes.string,
  errorMessage: PropTypes.string,
  initialValues: PropTypes.object,
  isAdmin: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

AddForm.defaultProps = {
  editingItemId: null,
  errorMessage: null,
  initialValues: {},
  isAdmin: false
}

export default AddForm
