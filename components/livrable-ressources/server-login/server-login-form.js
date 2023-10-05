import PropTypes from 'prop-types'

import TextInput from '@/components/text-input.js'
import Button from '@/components/button.js'

const ServerLoginForm = ({host, username, password, onValueChange, handleSubmit}) => (
  <form className='fr-grid-row fr-grid-row--center fr-grid-row--gutters' onSubmit={handleSubmit}>
    <div className='fr-grid-row fr-grid-row--gutters fr-my-3w'>
      <div className='fr-grid-row fr-grid-row--center fr-col-12'>
        <div className='fr-col-10'>
          <TextInput
            isDisabled
            label='URL'
            description='Lien d’accès au(x) fichier(s)'
            value={host}
            onValueChange={e => onValueChange('user', e.target.value)}
          />
        </div>
      </div>

      <div className='fr-grid-row fr-grid-row--center fr-col-12'>
        <div className='fr-col-10'>
          <TextInput
            label='Identifiant'
            value={username}
            description='Identifiant permettant l’accès au serveur'
            onValueChange={e => onValueChange('username', e.target.value)}
          />
        </div>
      </div>

      <div className='fr-grid-row fr-grid-row--center fr-col-12'>
        <div className='fr-col-10'>
          <TextInput
            label='Mot de passe'
            description='Entrer le mot de passe permettant l’accès au(x) fichier(s)'
            value={password}
            type='password'
            autoComplete='off'
            onValueChange={e => onValueChange('password', e.target.value)}
          />
        </div>
      </div>
    </div>

    <div className='fr-grid-row fr-grid-row--center fr-col-12'>
      <Button type='submit' label='Connexion au serveur'>
        Se connecter au serveur
      </Button>
    </div>
  </form>
)

ServerLoginForm.propTypes = {
  host: PropTypes.string.isRequired,
  username: PropTypes.string,
  password: PropTypes.string,
  onValueChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default ServerLoginForm
