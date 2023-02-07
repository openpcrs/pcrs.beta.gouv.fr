import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

const NumberInput = ({label, value, name, min, max, errorMessage, description, isRequired, onValueChange}) => {
  const [minMaxError, setMinMaxError] = useState(null)

  const inputState = minMaxError || errorMessage ? 'error' : ''

  useEffect(() => {
    const hasMin = min === 0 || min
    const hasMax = max === 0 || max

    if ((hasMin && !hasMax) && value < min) {
      setMinMaxError(`La valeur est inférieur à ${min}`)
    }

    if ((!hasMin && hasMax) && value > max) {
      setMinMaxError(`La valeur est supérieur à ${max}`)
    }

    if ((hasMin && hasMax) && (value < min || value > max)) {
      setMinMaxError(`La valeur doit être comprise entre ${min} et ${max}`)
    } else {
      setMinMaxError(null)
    }
  }, [value, min, max])

  return (
    <div className={`fr-input-group fr-input-group--${inputState}`}>
      <label
        className='fr-label'
        htmlFor={`text-input-${inputState}`}
      >
        {label}
        {description && <span className='fr-hint-text fr-mb-2w'>{description}</span>}
      </label>
      <input
        required={isRequired}
        value={value}
        min={min}
        max={max}
        type='number'
        name={name}
        pattern='[0-9]+'
        className={`fr-input fr-input--${inputState}`}
        onChange={e => onValueChange(e.target.value)}
      />

      {(minMaxError || errorMessage) && (
        <p id='text-input-error-desc-error' className='fr-error-text'>
          {minMaxError || errorMessage}
        </p>
      )}
    </div>
  )
}

NumberInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  name: PropTypes.string.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  errorMessage: PropTypes.string,
  description: PropTypes.string,
  isRequired: PropTypes.bool,
  onValueChange: PropTypes.func.isRequired
}

NumberInput.defaultProps = {
  value: '',
  min: null,
  max: null,
  errorMessage: null,
  description: null,
  isRequired: false
}

export default NumberInput