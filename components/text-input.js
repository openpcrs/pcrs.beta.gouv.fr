import PropTypes from 'prop-types'

const TextInput = ({label, value, ariaLabel, placeholder, errorMessage, description, isRequired, isDisabled, onValueChange}) => {
  const inputState = errorMessage ? 'error' : ''

  return (
    <div className={`fr-input-group fr-input-group--${inputState}`}>
      <label className='fr-label'>
        {label}
        {description && <span className='fr-hint-text fr-mb-2w'>{description}</span>}
      </label>

      <input
        type='text'
        required={isRequired}
        className={`fr-input fr-input--${inputState}`}
        value={value}
        aria-label={ariaLabel}
        placeholder={placeholder}
        disabled={isDisabled}
        onChange={e => onValueChange(e.target.value)}
      />

      {errorMessage && <p id='text-input-error-desc-error' className='fr-error-text'>{errorMessage}</p>}
    </div>
  )
}

TextInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  ariaLabel: PropTypes.string,
  placeholder: PropTypes.string,
  errorMessage: PropTypes.string,
  description: PropTypes.string,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onValueChange: PropTypes.func
}

TextInput.defaultProps = {
  label: '',
  value: '',
  ariaLabel: '',
  placeholder: null,
  errorMessage: null,
  description: null,
  isRequired: false,
  isDisabled: false
}

export default TextInput