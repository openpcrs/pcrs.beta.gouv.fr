import {useEffect, useState} from 'react'
import PropTypes from 'prop-types'

const TextInput = (
  {
    label,
    value,
    type,
    min,
    max,
    ariaLabel,
    placeholder,
    errorMessage,
    description,
    isNumber,
    isRequired,
    isDisabled,
    onValueChange,
    handleInvalidInput,
    onFocus,
    onBlur
  }) => {
  const [inputError, setInputError] = useState(null)

  const inputState = inputError ? 'error' : ''

  useEffect(() => {
    setInputError(null)
    if (value) {
      if (isNumber) {
        let numberErrorMessage = null
        const hasMin = min === 0 || min
        const hasMax = max === 0 || max

        if (Number(value) !== 0 && !Number(value)) {
          numberErrorMessage = 'Veuillez entrer uniquement des nombres'
        }

        if ((hasMin && !hasMax) && value < min) {
          numberErrorMessage = `La valeur est inférieure à ${min}`
        }

        if ((!hasMin && hasMax) && value > max) {
          numberErrorMessage = `La valeur est supérieure à ${max}`
        }

        if ((hasMin && hasMax) && (value < min || value > max)) {
          numberErrorMessage = `La valeur doit être comprise entre ${min} et ${max}`
        }

        setInputError(numberErrorMessage)
      } else if (errorMessage) {
        setInputError(errorMessage)
      }
    }
  }, [value, min, max, errorMessage, isNumber])

  useEffect(() => {
    if (inputError) {
      handleInvalidInput(true)
    } else {
      handleInvalidInput(false)
    }
  }, [inputError, errorMessage, handleInvalidInput])

  return (
    <div className={`fr-input-group fr-input-group--${inputState}`}>
      <label className='fr-label'>
        <div className={isRequired ? 'required-label' : ''}>{label}</div>
        {description && <span className='fr-hint-text fr-mb-2w fr-mt-0'>{description}</span>}
      </label>

      <input
        type={type}
        required={isRequired}
        className={`fr-input fr-input--${inputState}`}
        value={value}
        aria-label={ariaLabel}
        placeholder={placeholder}
        disabled={isDisabled}
        onChange={onValueChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />

      {(inputError) && (
        <p id='text-input-error-desc-error' className='fr-error-text'>
          {inputError}
        </p>
      )}

      <style jsx>{`
        .required-label::after {
          content: '*';
          margin-left: 5px
        }
      `}</style>
    </div>
  )
}

TextInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  type: PropTypes.oneOf([
    'text',
    'password'
  ]),
  ariaLabel: PropTypes.string,
  placeholder: PropTypes.string,
  errorMessage: PropTypes.string,
  description: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  isNumber: PropTypes.bool,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onValueChange: PropTypes.func,
  handleInvalidInput: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
}

TextInput.defaultProps = {
  label: '',
  value: '',
  type: 'text',
  ariaLabel: '',
  placeholder: null,
  errorMessage: null,
  description: null,
  min: null,
  max: null,
  isNumber: null,
  isRequired: false,
  isDisabled: false,
  onFocus: null,
  onBlur: null,
  handleInvalidInput() {}
}

export default TextInput
