import {useState} from 'react'
import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

import TextInput from '@/components/text-input.js'
import Button from '@/components/button.js'

const AddForm = ({onClose, errorMessage, validationMessage, isAdmin, onSubmit}) => {
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = event => {
    event.preventDefault()

    onSubmit(nom, email)
  }

  return (
    <form className='fr-grid-row fr-my-6w fr-pb-4w' onSubmit={handleSubmit}>
      <div className='fr-grid-row fr-grid-row--gutters fr-col-12 '>
        <div className='fr-col-12 fr-col-md-4'>
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
        <div className='fr-col-12 fr-col-md-4'>
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

      <div className='fr-grid-row fr-mt-3w'>
        <div className='fr-grid-row fr-col-12'>

          <div className='fr-pr-3w'>
            <Button
              label={`Annuler l’ajout ${isAdmin ? 'de l’administrateur' : 'du porteur'}`}
              buttonStyle='tertiary'
              onClick={onClose}
            >
              Annuler
            </Button>
          </div>
          <Button
            type='submit'
            label={`Valider l’ajout ${isAdmin ? 'de l’administrateur' : 'du porteur'}`}
            icon='checkbox-circle-fill'
          >
            Valider
          </Button>
        </div>
        {validationMessage && <p className='fr-valid-text fr-col-12 fr-mt-2w'>{validationMessage}</p>}
        {errorMessage && <p className='fr-error-text fr-col-12 fr-mt-2w'>{errorMessage}</p>}
      </div>

      <style jsx>{`
        form {
          border-bottom: 2px solid ${colors.grey900};
        }
      `}</style>
    </form>
  )
}

AddForm.propTypes = {
  errorMessage: PropTypes.string,
  validationMessage: PropTypes.string,
  isAdmin: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

AddForm.defaultProps = {
  errorMessage: null,
  isAdmin: false,
  validationMessage: null
}

export default AddForm
