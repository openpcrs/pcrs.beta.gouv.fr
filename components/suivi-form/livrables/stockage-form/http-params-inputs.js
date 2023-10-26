import {useState} from 'react'
import PropTypes from 'prop-types'

import {isURLValid} from '@/components/suivi-form/livrables/utils/url.js'
import {STOCKAGE_PARAMS} from '@/lib/utils/projet.js'

import TextInput from '@/components/text-input.js'

const HttpParamsInputs = ({stockageParams, handleParams}) => {
  const [url, setUrl] = useState(stockageParams?.url || '')
  const [errorMessage, setErrorMessage] = useState(null)

  function handleHttpChange(url) {
    setUrl(url)

    if (isURLValid(url)) {
      setErrorMessage(null)
    } else {
      setErrorMessage('Cette URL n’est pas valide')
    }

    handleParams({url})
  }

  return (
    <div className='fr-mt-6v'>
      <TextInput
        name='url'
        label={STOCKAGE_PARAMS.url.label}
        description='Lien d’accès au(x) fichier(s)'
        value={url}
        placeholder='http://...'
        errorMessage={errorMessage}
        onValueChange={e => handleHttpChange(e.target.value)}
      />
    </div>
  )
}

HttpParamsInputs.propTypes = {
  stockageParams: PropTypes.shape({
    url: PropTypes.string
  }),
  handleParams: PropTypes.func.isRequired
}

export default HttpParamsInputs
