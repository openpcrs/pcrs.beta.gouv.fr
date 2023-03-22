import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

const NumberInput = ({label, value, ariaLabel, min, max, placeholder, errorMessage, description, isRequired, isDisabled, onIsInvalid, onValueChange}) => {
  const [minMaxError, setMinMaxError] = useState(null)

  const inputState = minMaxError || errorMessage ? 'error' : ''

  useEffect(() => {
    let errorMessage = null
    const hasMin = min === 0 || min
    const hasMax = max === 0 || max

    if ((hasMin && !hasMax) && value < min) {
      errorMessage = `La valeur est inférieure à ${min}`
    }

    if ((!hasMin && hasMax) && value > max) {
      errorMessage = `La valeur est supérieure à ${max}`
    }

    if ((hasMin && hasMax) && (value < min || value > max)) {
      errorMessage = `La valeur doit être comprise entre ${min} et ${max}`
    }

    setMinMaxError(errorMessage)
  }, [value, min, max])

  useEffect(() => {
    if (minMaxError) {
      onIsInvalid(true)
    } else {
      onIsInvalid(false)
    }
  }, [minMaxError, onIsInvalid])

  return (
    <div className={`fr-input-group fr-input-group--${inputState}`} >
      <label className={`fr-label  ${isRequired ? 'required-label' : ''}`}>
        {label}
        {description && <span className='fr-hint-text fr-mb-2w fr-mt-0'>{description}</span>}
      </label>

      <input
        required={isRequired}
        value={value}
        min={min}
        max={max}
        placeholder={placeholder}
        disabled={isDisabled}
        aria-label={ariaLabel}
        type='number'
        pattern='[0-9]+'
        className={`fr-input fr-input--${inputState}`}
        onChange={e => onValueChange(e.target.value)}
      />

      {(minMaxError || errorMessage) && (
        <p id='text-input-error-desc-error' className='fr-error-text'>
          {minMaxError || errorMessage}
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
  ariaLabel: PropTypes.string,
  placeholder: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  errorMessage: PropTypes.string,
  description: PropTypes.string,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onIsInvalid: PropTypes.func.isRequired,
  onValueChange: PropTypes.func.isRequired
}

NumberInput.defaultProps = {
  label: '',
  value: '',
  ariaLabel: '',
  min: null,
  max: null,
  placeholder: null,
  errorMessage: null,
  description: null,
  isRequired: false,
  isDisabled: false
}

export default NumberInput
