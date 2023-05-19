import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

const NumberInput = ({
  label,
  value,
  type,
  min,
  max,
  ariaLabel,
  placeholder,
  errorMessage,
  description,
  isRequired,
  isDisabled,
  onValueChange,
  setIsValueValid,
  onFocus,
  onBlur
}) => {
  const [inputError, setInputError] = useState(errorMessage)

  const inputState = inputError ? 'error' : ''

  useEffect(() => {
    setInputError(null)

    if (value) {
      let inputErrorMessage = null
      const hasMin = min === 0 || min
      const hasMax = max === 0 || max

      if (Number(value) !== 0 && !Number(value)) {
        inputErrorMessage = 'Veuillez entrer uniquement des nombres'
      }

      if ((hasMin && !hasMax) && value < min) {
        inputErrorMessage = `La valeur est inférieure à ${min}`
      }

      if ((!hasMin && hasMax) && value > max) {
        inputErrorMessage = `La valeur est supérieure à ${max}`
      }

      if ((hasMin && hasMax) && (value < min || value > max)) {
        inputErrorMessage = `La valeur doit être comprise entre ${min} et ${max}`
      }

      setInputError(inputErrorMessage)
    }
  }, [value, min, max, errorMessage])

  useEffect(() => {
    if (inputError) {
      setIsValueValid(false)
    } else {
      setIsValueValid(true)
    }
  }, [value, inputError, setIsValueValid])

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

NumberInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.string,
  ariaLabel: PropTypes.string,
  placeholder: PropTypes.string,
  errorMessage: PropTypes.string,
  description: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onValueChange: PropTypes.func,
  setIsValueValid: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
}

NumberInput.defaultProps = {
  label: '',
  value: '',
  type: 'text',
  ariaLabel: '',
  placeholder: null,
  errorMessage: null,
  description: null,
  min: null,
  max: null,
  isRequired: false,
  isDisabled: false,
  onFocus: null,
  onBlur: null,
  setIsValueValid() {}
}

export default NumberInput
