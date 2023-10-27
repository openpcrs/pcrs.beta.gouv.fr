import PropTypes from 'prop-types'

import {STOCKAGE_PARAMS} from '@/lib/utils/projet.js'

import TextInput from '@/components/text-input.js'

const HttpParamsInputs = ({url, handleUrl, validationMessage}) => (
  <div className='fr-mt-6v'>
    <TextInput
      name='url'
      label={STOCKAGE_PARAMS.url.label}
      description='Lien d’accès au(x) fichier(s)'
      value={url}
      placeholder='http://...'
      errorMessage={validationMessage}
      onValueChange={e => handleUrl(e.target.value)}
    />
  </div>
)

HttpParamsInputs.propTypes = {
  url: PropTypes.string,
  handleUrl: PropTypes.func.isRequired,
  validationMessage: PropTypes.string
}

export default HttpParamsInputs
