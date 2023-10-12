import {useState} from 'react'
import PropTypes from 'prop-types'

import {isURLValid} from '@/components/suivi-form/livrables/utils/url.js'

import TextInput from '@/components/text-input.js'
import Button from '@/components/button.js'

const HttpForm = ({initialValues, onSubmit, onCancel}) => {
  const [url, setUrl] = useState(initialValues.url)
  const [errorMessage, setErrorMessage] = useState(null)

  function handleHttpSubmit() {
    if (isURLValid(url)) {
      setErrorMessage(null)
      onSubmit({url})
    } else {
      setErrorMessage('Cette URL n’est pas valide')
    }
  }

  return (
    <div className='fr-mt-6v'>
      <TextInput
        label='URL du serveur'
        description='Lien d’accès au(x) fichier(s)'
        value={url || ''}
        placeholder='http://...'
        errorMessage={errorMessage}
        onValueChange={e => setUrl(e.target.value)}
      />

      <div className='fr-mt-3w'>
        <Button
          label='Ajouter le serveur'
          isDisabled={!url}
          onClick={() => handleHttpSubmit()}
        >
          Ajouter le serveur HTTP
        </Button>
        <Button
          style={{marginLeft: '1em'}}
          buttonStyle='secondary'
          label='Annuler l’ajout du serveur'
          onClick={onCancel}
        >
          Annuler
        </Button>
      </div>
    </div>
  )
}

HttpForm.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

export default HttpForm
