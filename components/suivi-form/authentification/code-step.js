import {useState} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'

import {checkCode} from '@/lib/authentification.js'

import DigitCodeInput from '@/components/digit-code-input.js'
import Button from '@/components/button.js'

const CodeStep = ({email, handleError, handleToken, handleValidation, handleStep}) => {
  const router = useRouter()

  const [pinCode, setPinCode] = useState('')

  const handleAuthentification = async e => {
    e.preventDefault()

    if (pinCode) {
      try {
        const editor = await checkCode(email, pinCode)
        if (editor.token) {
          handleToken(editor.token)
          handleValidation('Utilisateur authentifié avec succès ! Vous allez accéder au formulaire.')

          setTimeout(() => {
            router.push('/formulaire-suivi')
          }, 2000)

          handleStep()
        } else {
          handleError(editor.message)
        }
      } catch {
        handleError('L’authentification a échouée. Veuillez entrer un jeton valide')
      }
    } else {
      handleError('Veuillez entrer un jeton')
    }
  }

  return (
    <div>
      <p>Vous avez reçu un code d’authentification par email. Si celui-ci n’apparait pas dans votre boite de réception, pensez à vérifier vos spams. <br />
        <b>Attention, ce code n’est valable que 10 minutes après envoi.</b>
      </p>
      <div className='fr-container fr-mt-6w fr-grid-row fr-grid-row--center'>
        <form className='fr-col-12' onSubmit={handleAuthentification}>
          <div className='fr-col-12'>
            <DigitCodeInput
              isRequired
              codeValue={pinCode}
              handleCodeValue={setPinCode}
              codeLength={6}
            />
          </div>
          <div className='fr-col-12 fr-grid-row fr-grid-row--center fr-mt-3w'>
            <Button
              isDisabled={pinCode.length < 6}
              type='submit'
              label='Valider le code'
            >
              Valider le code
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

CodeStep.propTypes = {
  email: PropTypes.string.isRequired,
  handleError: PropTypes.func.isRequired,
  handleToken: PropTypes.func.isRequired,
  handleValidation: PropTypes.func.isRequired,
  handleStep: PropTypes.func.isRequired
}

export default CodeStep
