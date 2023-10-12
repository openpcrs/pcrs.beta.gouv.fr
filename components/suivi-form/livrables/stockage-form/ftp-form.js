import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

import {isURLValid} from '@/components/suivi-form/livrables/utils/url.js'

import TextInput from '@/components/text-input.js'
import NumberInput from '@/components/number-input.js'
import Button from '@/components/button.js'

const FtpForm = ({initialValues, onSubmit, onCancel}) => {
  const [values, setValues] = useState(initialValues)
  const [errorMessage, setErrorMessage] = useState({hostInput: null, submitError: null})
  const [checkedStatus, setCheckedStatus] = useState(false)

  function handleValuesChange(e) {
    setValues({...values, [e.target.name]: e.target.value})
  }

  function handleCheckedStatus(isChecked) {
    setValues({...values, secure: isChecked})
    setCheckedStatus(isChecked)
  }

  function handleSubmit() {
    setErrorMessage({hostInput: null, submitError: null})

    if (isURLValid(values.host)) {
      if ((!values.user && values.secure) || (values.secure && !values.password)) {
        setErrorMessage({...errorMessage, submitError: 'Un stockage sécurisé nécessite un nom d’utilisateur et un mot de passe'})
      } else {
        onSubmit(values)
        setErrorMessage({hostInput: null, submitError: null})
      }
    } else {
      setErrorMessage({...errorMessage, hostInput: 'Cette URL n’est pas valide'})
    }
  }

  useEffect(() => {
    if (!values.host) {
      setErrorMessage({hostInput: null, submitError: null})
    }
  }, [values.host])

  return (
    <div>
      <div className='fr-mt-6w'>
        <TextInput
          name='host'
          label='URL du serveur'
          placeholder='ftp://...'
          description='Lien d’accès au(x) fichier(s)'
          errorMessage={errorMessage.hostInput}
          value={values.host || ''}
          onValueChange={e => handleValuesChange(e)}
        />
      </div>

      {values.host && (
        <div>
          <div className='fr-mt-6w'>
            <TextInput
              name='path'
              label='Chemin'
              placeholder='"/" par défaut'
              description='Chemin du dossier contenant le livrable'
              value={values.path || ''}
              onValueChange={e => handleValuesChange(e)}
            />
          </div>

          <div className='fr-mt-6w'>
            <NumberInput
              name='port'
              label='Port'
              placeholder='Port 21 par défaut'
              description='Port de connexion au service FTP'
              value={values.port || ''}
              onValueChange={e => handleValuesChange(e)}
            />
          </div>

          <div className='fr-mt-6w input-container'>
            <input
              type='checkbox'
              name='secure'
              checked={checkedStatus}
              onChange={() =>
                handleCheckedStatus(!checkedStatus)}
            />
            <label className='fr-label'>
              Ce serveur est privé
            </label>
          </div>

          {checkedStatus && (
            <div>
              <div className='fr-mt-6w'>
                <TextInput
                  isRequired
                  name='user'
                  label='Nom d’utilisateur'
                  description='Identifiant permettant l’accès au serveur'
                  value={values.user || ''}
                  onValueChange={e => handleValuesChange(e)}
                />
              </div>

              <div className='fr-mt-6w'>
                <TextInput
                  isRequired
                  name='password'
                  label='Mot de passe'
                  type='password'
                  description='Entrer le mot de passe permettant l’accès au(x) fichier(s)'
                  value={values.password || ''}
                  onValueChange={e => handleValuesChange(e)}
                />
              </div>
            </div>
          )}

          <div className='fr-mt-3w'>
            <Button
              label='Ajouter le serveur'
              isDisabled={!values.host}
              onClick={() => handleSubmit(values)}
            >
              Ajouter le serveur FTP
            </Button>
            <Button
              style={{marginLeft: '1em'}}
              label='Annuler l’ajout du serveur'
              buttonStyle='secondary'
              onClick={onCancel}
            >
              Annuler
            </Button>
          </div>
        </div>
      )}

      {errorMessage.submitError && <p id='text-input-error-desc-error' className='fr-error-text'>{errorMessage.submitError}</p>}
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

FtpForm.propTypes = {
  initialValues: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default FtpForm
