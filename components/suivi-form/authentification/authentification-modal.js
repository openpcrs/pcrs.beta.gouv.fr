import {useState, useContext} from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'

import AuthentificationContext from '@/contexts/authentification-token.js'

import EmailStep from '@/components/suivi-form/authentification/email-step.js'
import CodeStep from '@/components/suivi-form/authentification/code-step.js'
import Modal from '@/components/modal.js'
import Loader from '@/components/loader.js'

const AuthentificationModal = ({isNewForm, handleModalClose}) => {
  const {storeToken} = useContext(AuthentificationContext)

  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [validationMessage, setValidationMessage] = useState(null)
  const [step, setStep] = useState(1)

  return (
    <Modal title='S’authentifier' onClose={handleModalClose}>
      <div className='fr-my-3w'>
        {/* Send code by email */}
        {step === 1 && (
          <EmailStep
            email={email}
            handleEmail={setEmail}
            handleError={setErrorMessage}
            handleStep={() => setStep(2)}
          />
        )}

        {/* Enter received code */}
        {step === 2 && (
          <CodeStep
            email={email}
            handleError={setErrorMessage}
            handleValidation={setValidationMessage}
            handleToken={storeToken}
            handleStep={() => setStep(3)}
            isNewForm={isNewForm}
          />
        )}

        {(step === 3) && (
          <div className='fr-container'>
            <div className='fr-grid-row fr-grid-row--center'>
              <Image src='/images/icons/unlock.png' height={110} width={100} />
            </div>
          </div>
        )}
      </div>

      {validationMessage && (
        <div className='fr-grid-row fr-grid-row--center'>
          <p className='fr-grid-row fr-grid-row--center fr-valid-text fr-col-12 fr-mt-2w fr-mb-2w'>
            {validationMessage}
          </p>
          {(step === 3 && isNewForm) && <Loader size='small' />}
        </div>
      )}

      {errorMessage && (
        <p className='fr-grid-row fr-grid-row--center fr-col-12 fr-mt-2w fr-mb-0 fr-error-text'>
          {errorMessage}
        </p>
      )}
    </Modal>
  )
}

AuthentificationModal.propTypes = {
  isNewForm: PropTypes.bool,
  handleModalClose: PropTypes.func.isRequired
}

AuthentificationModal.defaultProps = {
  isNewForm: false
}

export default AuthentificationModal
