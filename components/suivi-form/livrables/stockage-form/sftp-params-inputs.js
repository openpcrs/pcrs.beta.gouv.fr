import PropTypes from 'prop-types'

import {STOCKAGE_PARAMS} from '@/lib/utils/projet.js'

import TextInput from '@/components/text-input.js'
import NumberInput from '@/components/number-input.js'

const SftpParamsInputs = ({stockageParams, handleParams}) => {
  const handleValuesChange = e => {
    handleParams({...stockageParams, [e.target.name]: e.target.value})
  }

  return (
    <div>
      <div className='fr-grid-row fr-mt-6w'>
        <div className='fr-col-12 fr-col-md-6'>
          <TextInput
            isRequired
            name='host'
            label='Nom d’hôte'
            placeholder='sftp3.ign.fr'
            description='Nom d’hôte du serveur ou adresse IP'
            value={stockageParams.host || ''}
            onValueChange={handleValuesChange}
          />
        </div>
        <div className='fr-col-12 fr-mt-3w fr-mt-md-0 fr-col-md-6 fr-pl-md-3w'>
          <NumberInput
            name='port'
            label={STOCKAGE_PARAMS.port.label}
            placeholder=''
            description='Port d’écoute du service SFTP'
            value={stockageParams.port || ''}
            onValueChange={handleValuesChange}
          />
        </div>
      </div>

      <div className='fr-mt-6w'>
        <TextInput
          name='startPath'
          label={STOCKAGE_PARAMS.startPath.label}
          placeholder='"/" par défaut'
          description='Chemin du répertoire contenant les fichiers du livrable. Le processus d’analyse prendra en compte tous les fichiers et répertoires accessibles à partir de ce chemin.'
          value={stockageParams.startPath || ''}
          onValueChange={handleValuesChange}
        />
      </div>

      <div className='fr-grid-row fr-mt-6w'>
        <div className='fr-col-12 fr-col-md-6'>
          <TextInput
            isRequired
            name='username'
            label={STOCKAGE_PARAMS.username.label}
            description=''
            value={stockageParams.username || ''}
            autoComplete='off'
            onValueChange={handleValuesChange}
          />
        </div>

        <div className='fr-col-12 fr-mt-3w fr-mt-md-0 fr-col-md-6 fr-pl-md-3w'>
          <TextInput
            isRequired
            name='password'
            label={STOCKAGE_PARAMS.password.label}
            type='password'
            description=''
            value={stockageParams.password || ''}
            autoComplete='off'
            onValueChange={handleValuesChange}
          />
        </div>
      </div>

      <style jsx>{`
        .input-container {
          display: flex;
          width: 400px;
        }

        .input-container label {
          padding-left: 1em;
        }
      `}</style>
    </div>
  )
}

SftpParamsInputs.propTypes = {
  stockageParams: PropTypes.shape({
    host: PropTypes.string,
    port: PropTypes.string,
    startPath: PropTypes.string,
    username: PropTypes.string,
    password: PropTypes.string
  }),
  handleParams: PropTypes.func.isRequired
}

export default SftpParamsInputs
