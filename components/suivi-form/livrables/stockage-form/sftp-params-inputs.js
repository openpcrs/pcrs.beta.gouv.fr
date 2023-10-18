import {useState} from 'react'
import PropTypes from 'prop-types'

import TextInput from '@/components/text-input.js'
import NumberInput from '@/components/number-input.js'

const SftpParamsInputs = ({stockageParams, handleParams}) => {
  const [values, setValues] = useState(stockageParams)

  function handleValuesChange(e) {
    setValues({...values, [e.target.name]: e.target.value})
    handleParams(values)
  }

  return (
    <div>
      <div className='fr-mt-6w'>
        <TextInput
          isRequired
          name='host'
          label='Nom d’hôte'
          placeholder='sftp3.ign.fr'
          description='Nom d’hôte du serveur ou adresse IP'
          value={values.host || ''}
          onValueChange={e => handleValuesChange(e)}
        />
      </div>

      <div>
        <div className='fr-mt-6w'>
          <NumberInput
            name='port'
            label='Port'
            placeholder=''
            description='Port d’écoute du service SFTP'
            value={values.port || ''}
            onValueChange={e => handleValuesChange(e)}
          />
        </div>

        <div className='fr-mt-6w'>
          <TextInput
            name='startPath'
            label='Chemin du répertoire'
            placeholder='"/" par défaut'
            description='Chemin du répertoire contenant les fichiers du livrable. Le processus d’analyse prendra en compte tous les fichiers et répertoires accessibles à partir de ce chemin.'
            value={values.startPath || ''}
            onValueChange={e => handleValuesChange(e)}
          />
        </div>

        <div className='fr-grid-row fr-mt-6w'>
          <div className='fr-col-12 fr-col-md-6'>
            <TextInput
              isRequired
              name='username'
              label='Nom d’utilisateur'
              description=''
              value={values.username || ''}
              onValueChange={e => handleValuesChange(e)}
            />
          </div>

          <div className='fr-col-12 fr-mt-3w fr-mt-md-0 fr-col-md-6 fr-pl-md-3w'>
            <TextInput
              isRequired
              name='password'
              label='Mot de passe'
              type='password'
              description=''
              value={values.password || ''}
              onValueChange={e => handleValuesChange(e)}
            />
          </div>
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
  stockageParams: PropTypes.object,
  handleParams: PropTypes.func.isRequired
}

export default SftpParamsInputs
