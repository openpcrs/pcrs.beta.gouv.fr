import {useState} from 'react'
import PropTypes from 'prop-types'

import TextInput from '@/components/text-input.js'
import Button from '@/components/button.js'

const HttpForm = ({initialValues, onSubmit, onCancel}) => {
  const [values, setValues] = useState(initialValues || {})
  const [errorMessage, setErrorMessage] = useState(null)

  // Ajouter un bouton ajouter éditer supprimer

  function isURLValid(url) {
    const pattern = /(\b(https?|ftp|file):\/\/[-\w+&@#/%?=~|!:,.;]*[-\w+&@#/%=~|])/i
    return pattern.test(url)
  }

  function handleSubmit() {
    if (isURLValid(values?.value)) {
      setErrorMessage(null)
      onSubmit(...values)
    } else {
      setErrorMessage('Cette URL n’est pas valide')
    }
  }

  return (
    <div className='fr-mt-6v'>
      <TextInput
        label='URL du serveur'
        description='Lien d’accès au(x) fichier(s)'
        value={values?.value}
        placeholder='http://...'
        errorMessage={errorMessage}
        onValueChange={e => setValues({name: 'url', value: e.target.value})}
      />
      <Button
        label='Annuler l’ajout du serveur'
        onClick={onCancel}
      >
        Annuler
      </Button>
      <Button
        style={{marginLeft: '1em'}}
        label='Ajouter le serveur'
        isDisabled={!values?.value}
        onClick={() => handleSubmit(values)}
      >
        Ajouter le serveur HTTP
      </Button>
    </div>
  )
}

HttpForm.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

export default HttpForm
