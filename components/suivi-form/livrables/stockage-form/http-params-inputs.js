import PropTypes from 'prop-types'

import {STOCKAGE_PARAMS} from '@/lib/utils/projet.js'

import TextInput from '@/components/text-input.js'

const HttpParamsInputs = ({url, externalUrl, handleUrl, handleExternalUrl, validationMessage}) => (
  <div className='fr-mt-6v'>
    <TextInput
      name='url'
      label={STOCKAGE_PARAMS.url.label}
      description='Lien d’accès au(x) fichier(s)'
      value={url}
      placeholder='http://...'
      errorMessage={validationMessage?.url}
      onValueChange={e => handleUrl(e.target.value)}
    />
    <TextInput
      name='url_externe'
      label={STOCKAGE_PARAMS.url_externe.label}
      description='Portail local, plateforme préstataire, non scannée'
      value={externalUrl}
      placeholder='http://...'
      errorMessage={validationMessage?.url_externe}
      onValueChange={e => handleExternalUrl(e.target.value)}
    />
  </div>
)

HttpParamsInputs.propTypes = {
  url: PropTypes.string,
  externalUrl: PropTypes.string,
  handleUrl: PropTypes.func.isRequired,
  handleExternalUrl: PropTypes.func.isRequired,
  validationMessage: PropTypes.object
}

export default HttpParamsInputs
