import {useState} from 'react'
import PropTypes from 'prop-types'

import TextInput from '@/components/text-input.js'
// import RadioButton from '@/components/ui/radio-button.js'
import NumberInput from '@/components/number-input.js'

const FtpForm = ({values, onValueChange}) => {
  const {stockageParams} = values
  const [checkedStatus, setCheckedStatus] = useState('public')

  const onSecureChange = e => {
    setCheckedStatus(e.target.value)

    onValueChange({...values,
      stockageParams: {...stockageParams,
        secure: checkedStatus !== 'private'}
    })
  }

  return (
    <div>
      <div>
        <TextInput
          label='URL du serveur'
          placeholder='ftp://...'
          description='Lien d’accès au(x) fichier(s)'
          value={stockageParams.host}
          onValueChange={e =>
            onValueChange({
              ...values,
              stockageParams: {...stockageParams, host: e.target.value}
            })}
        />
      </div>

      {stockageParams.host && (
        <div>
          <div className='fr-mt-6w'>
            <TextInput
              label='Chemin'
              placeholder='"/" par défaut'
              description='Chemin du dossier contenant le livrable'
              value={stockageParams.path}
              onValueChange={e =>
                onValueChange({
                  ...values,
                  stockageParams: {...stockageParams, path: e.target.value}
                })}
            />
          </div>

          <div className='fr-mt-6w'>
            <NumberInput
              label='Port'
              placeholder='Port 21 par défaut'
              description='Port de connexion au service FTP'
              value={stockageParams.port}
              onValueChange={e =>
                onValueChange({
                  ...values,
                  stockageParams: {...stockageParams, port: e.target.value}
                })}
            />
          </div>

          <div className='fr-mt-6w'>
            {/* <RadioButton */}
            {/*   label='Public' */}
            {/*   description='Par défaut, la source est considérée comme publique' */}
            {/*   type='radio' */}
            {/*   name='status' */}
            {/*   value='public' */}
            {/*   id='public' */}
            {/*   isCheck={checkedStatus === 'public'} */}
            {/*   size='sm' */}
            {/*   onOptionChange={onSecureChange} */}
            {/* /> */}
            {/**/}
            {/* <RadioButton */}
            {/*   label='Privé' */}
            {/*   type='radio' */}
            {/*   name='status' */}
            {/*   value='private' */}
            {/*   id='private' */}
            {/*   isCheck={checkedStatus === 'private'} */}
            {/*   size='sm' */}
            {/*   onOptionChange={onSecureChange} */}
            {/* /> */}
          </div>

          {checkedStatus === 'private' && (
            <div>
              <div className='fr-mt-6w'>
                <TextInput
                  isRequired
                  label='Nom d’utilisateur'
                  description='Identifiant permettant l’accès au serveur'
                  value={stockageParams.username}
                  onValueChange={e =>
                    onValueChange({
                      ...values,
                      stockageParams: {...stockageParams, username: e.target.value}
                    })}
                />
              </div>

              <div className='fr-mt-6w'>
                <TextInput
                  isRequired
                  label='Mot de passe'
                  type='password'
                  description='Entrer le mot de passe permettant l’accès au(x) fichier(s)'
                  value={stockageParams.password}
                  onValueChange={e =>
                    onValueChange({
                      ...values,
                      stockageParams: {...stockageParams, password: e.target.value}
                    })}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

FtpForm.propTypes = {
  values: PropTypes.object,
  onValueChange: PropTypes.func.isRequired
}

export default FtpForm
