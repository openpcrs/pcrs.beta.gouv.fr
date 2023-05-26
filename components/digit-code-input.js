import {useState} from 'react'
import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

const DigitCodeInput = ({codeValue, handleCodeValue, codeLength, isRequired}) => {
  const [codeMask, setCodeMask] = useState('_'.repeat(codeLength))

  const handleCodeChange = event => {
    // Récupérer la valeur de l'input
    const {value} = event.target

    // Supprimer tous caractères spéciaux dans l'input
    const input = value.replaceAll('_', '').replace(/[^a-zA-Z\d]/g, '')

    if (input.length < codeLength + 1) {
      // Si on efface, supprimer la dernière valeur de l'input
      const hasMissingNumbers = value.length < codeLength && codeValue.length < codeLength
      const newCode = input.slice(0, hasMissingNumbers ? -1 : codeLength)

      // On set code avec la bonne valeur, cleané de tout caractères spéciaux
      handleCodeValue(newCode)
      // On set codeMask avec les bonnes valeurs + les underscores pour les chiffres encore manquants
      setCodeMask(newCode.padEnd(codeLength, '_'))
    }
  }

  return (
    <>
      <input
        autoFocus
        required={isRequired}
        type='text'
        name='code'
        value={codeMask}
        placeholder='Entrez votre code ici'
        className='fr-h2 fr-p-0 fr-col-12'
        onChange={handleCodeChange}
      />

      <style jsx>{`
        input {
          text-align: center;
          letter-spacing: 10px;
          font-weight: bold;
          color: ${colors.blueFranceSun113};
          background: ${colors.grey975};
          border-radius: 5px;
        }
      `}</style>
    </>

  )
}

DigitCodeInput.propTypes = {
  codeValue: PropTypes.string.isRequired,
  handleCodeValue: PropTypes.func.isRequired,
  codeLength: PropTypes.number,
  isRequired: PropTypes.bool
}

DigitCodeInput.defaultProps = {
  codeLength: 6,
  isRequired: false
}

export default DigitCodeInput
