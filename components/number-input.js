import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {handleRangeError} from './suivi-form/acteurs/utils/error-handlers.js'

const NumberInput = ({
  label,
  value,
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
  onBlur,
  ...props
}) => {
  const [inputError, setInputError] = useState(errorMessage)

  const inputState = inputError ? 'error' : ''

  useEffect(() => {
    const inputErrorMessage = handleRangeError(value, min, max)
    setInputError(inputErrorMessage)
  }, [value, min, max, errorMessage])

  useEffect(() => {
    setIsValueValid(!inputError)
  }, [inputError, setIsValueValid])

  return (
    <div className={`fr-input-group fr-input-group--${inputState}`}>
      <label className='fr-label'>
        <div className={isRequired ? 'required-label' : ''}>{label}</div>
        {description && <span className='fr-hint-text fr-mb-2w fr-mt-0'>{description}</span>}
      </label>

      <input
        {...props}
        type='number'
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
  ariaLabel: '',
  placeholder: null,
  errorMessage: null,
  description: null,
  isRequired: false,
  isDisabled: false,
  onFocus: null,
  onBlur: null,
  setIsValueValid() {}
}

export default NumberInput
