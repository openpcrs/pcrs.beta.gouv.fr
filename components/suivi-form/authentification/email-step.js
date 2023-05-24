import PropTypes from 'prop-types'

import {askCode} from '@/lib/authentification.js'

import TextInput from '@/components/text-input.js'
import Button from '@/components/button.js'

const EmailStep = ({email, handleEmail, handleStep, handleError}) => {
  const handleSendCode = async e => {
    e.preventDefault()
    handleError(null)

    try {
      const response = await askCode(email)

      if (response && response.message) {
        handleError(response.message)
      } else {
        handleStep()
      }
    } catch {
      handleError('Une erreur a été rencontrée')
    }
  }

  return (
    <div>
      <p>
        Pour créer <b>un nouveau projet PCRS</b>, vous devez en premier lieu obtenir une autorisation de la part d’un administrateur. Si ce n’est pas encore le cas, vous pouvez nous envoyer un mail à <a href='mailto:contact@pcrs.beta.gouv.fr'>contact@pcrs.beta.gouv.fr</a>.
      </p>

      <p>
        Dans le cas où vous êtes porteur de projet autorisé, veuillez entrer votre adresse e-mail. Vous recevrez alors par e-mail, le code d’authentification requis. <b>Attention, ce code n’est valable que 10 minutes après envoi.</b>
      </p>

      <div className='fr-container fr-mt-6w fr-grid-row fr-grid-row--center'>
        <form className='fr-col-12' onSubmit={handleSendCode}>
          <div className='fr-col-12'>
            <TextInput
              isRequired
              label='E-mail de porteur de projet'
              type='email'
              value={email}
              ariaLabel='Entrer votre email'
              description='Entrer l’adresse e-mail autorisée'
              onValueChange={e => handleEmail(e.target.value)}
            />
          </div>
          <div className='fr-col-12 fr-grid-row fr-grid-row--center fr-mt-3w'>
            <Button
              type='submit'
              label='Recevoir le code d’authentification'
            >
              Recevoir le code d’authentification
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

EmailStep.propTypes = {
  email: PropTypes.string.isRequired,
  handleEmail: PropTypes.func.isRequired,
  handleStep: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired
}

export default EmailStep
