import PropTypes from 'prop-types'

import TextInput from '@/components/text-input.js'

const HttpForm = ({values, onValueChange}) => {
  const {stockageParams} = values
  const {url} = stockageParams

  return (
    <div>
      <TextInput
        label='URL du serveur'
        description='Lien d’accès au(x) fichier(s)'
        value={url}
        placeholder='http://...'
        onValueChange={e =>
          onValueChange({
            ...values,
            stockageParams: {...stockageParams, url: e.target.value}
          })}
      />
    </div>
  )
}

HttpForm.propTypes = {
  values: PropTypes.object,
  onValueChange: PropTypes.func.isRequired
}

export default HttpForm
