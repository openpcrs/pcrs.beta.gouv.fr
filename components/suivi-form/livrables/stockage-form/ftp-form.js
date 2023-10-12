import {useState} from 'react'
import PropTypes from 'prop-types'

import {isURLValid} from '@/components/suivi-form/livrable/utils/url.js'

import TextInput from '@/components/text-input.js'
// import RadioButton from '@/components/ui/radio-button.js'
import NumberInput from '@/components/number-input.js'
import Button from '@/components/button.js'

const FtpForm = ({initialValues, onSubmit, onCancel}) => {
  const [values, setValues] = useState(initialValues || {})
  const [errorMessage, setErrorMessage] = useState(null)
  const [checkedStatus, setCheckedStatus] = useState(false)

  function handleValuesChange(e) {
    const newValues = {...values}
    newValues.stockageParams[e.target.name] = e.target.value
    setValues(newValues)
  }

  function handleCheckedStatus(isChecked) {
    setValues({...values, stockageParams: {...values.stockageParams, secure: isChecked}})
    setCheckedStatus(isChecked)
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
    <div>
      <div>
        <TextInput
          name='host'
          label='URL du serveur'
          placeholder='ftp://...'
          description='Lien d’accès au(x) fichier(s)'
          value={values?.stockageParams?.host}
          onValueChange={e => handleValuesChange(e)}
        />
      </div>

      {(initialValues?.host || values?.stockageParams?.host) && (
        <div>
          <div className='fr-mt-6w'>
            <TextInput
              name='path'
              label='Chemin'
              placeholder='"/" par défaut'
              description='Chemin du dossier contenant le livrable'
              value={values?.stockageParams?.path}
              onValueChange={e => handleValuesChange(e)}
            />
          </div>

          <div className='fr-mt-6w'>
            <NumberInput
              name='port'
              label='Port'
              placeholder='Port 21 par défaut'
              description='Port de connexion au service FTP'
              value={values?.stockageParams?.port}
              onValueChange={e => handleValuesChange(e)}
            />
          </div>

          <div className='fr-mt-6w input-container'>
            <input
              type='checkbox'
              name='secure'
              checked={checkedStatus}
              onChange={() => handleCheckedStatus(!checkedStatus)}
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
                  value={values?.stockageParams?.user}
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
                  value={values?.stockageParams?.password}
                  onValueChange={e => handleValuesChange(e)}
                />
              </div>
            </div>
          )}

          <Button
            label='Annuler l’ajout du serveur'
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button
            style={{marginLeft: '1em'}}
            label='Ajouter le serveur'
            isDisabled={!values?.stockageParams}
            onClick={() => handleSubmit(values)}
          >
            Ajouter le serveur HTTP
          </Button>
        </div>
      )}
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
  values: PropTypes.object,
  onValueChange: PropTypes.func.isRequired
}

export default FtpForm
