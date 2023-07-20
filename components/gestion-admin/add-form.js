import {useState} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'

import {addCreator} from '@/lib/suivi-pcrs.js'

import colors from '@/styles/colors.js'

import TextInput from '@/components/text-input.js'
import Button from '@/components/button.js'

const AddForm = ({token, onClose}) => {
  const router = useRouter()

  const [validationMessage, setValidationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')

  const onAdd = async e => {
    e.preventDefault()

    setErrorMessage(null)
    setValidationMessage(null)

    try {
      await addCreator(token, {nom, email})
      setValidationMessage(`${nom} a été ajouté à la liste des porteurs autorisés`)

      setTimeout(() => {
        router.reload(window.location.pathname)
      }, 1000)
    } catch (error) {
      setErrorMessage('Le nouveau porteur n’a pas pu être ajouté : ' + error)
    }
  }

  return (
    <form className='fr-grid-row fr-my-6w fr-pb-4w' onSubmit={onAdd}>
      <div className='fr-grid-row fr-grid-row--gutters fr-col-12 '>
        <div className='fr-col-12 fr-col-md-4'>
          <TextInput
            isRequired
            autoFocus
            label='Nom du porteur'
            ariaLabel='nom du porteur'
            value={nom}
            placeholder='Nom du porteur'
            onValueChange={e => setNom(e.target.value)}
          />
        </div>
        <div className='fr-col-12 fr-col-md-4'>
          <TextInput
            isRequired
            type='email'
            label='Email du porteur'
            ariaLabel='email du porteur'
            value={email}
            placeholder='Email du porteur'
            onValueChange={e => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className='fr-grid-row fr-mt-3w'>
        <div className='fr-grid-row fr-col-12'>

          <div className='fr-pr-3w'>
            <Button
              label='Annuler l’ajout du livrable'
              buttonStyle='tertiary'
              onClick={onClose}
            >
              Annuler
            </Button>
          </div>
          <Button
            type='submit'
            label='Valider l’ajout du porteur'
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
  token: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
}

export default AddForm
