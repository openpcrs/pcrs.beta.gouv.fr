import PropTypes from 'prop-types'

const TextInput = ({label, value, name, placeholder, errorMessage, description, isRequired, isDisable, onValueChange}) => {
  const inputState = errorMessage ? 'error' : ''

  return (
    <div className={`fr-input-group fr-input-group--${inputState}`}>
      <label className='fr-label' htmlFor={`text-input-${inputState}`}>
        {label}
        {description && <span className='fr-hint-text fr-mb-2w'>{description}</span>}
      </label>

      <input
        type='text'
        required={isRequired}
        className={`fr-input fr-input--${inputState}`}
        value={value}
        name={name}
        placeholder={placeholder}
        disabled={isDisable}
        onChange={e => onValueChange(e.target.value)}
      />

      {errorMessage && <p id='text-input-error-desc-error' className='fr-error-text'>{errorMessage}</p>}
    </div>
  )
}

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  errorMessage: PropTypes.string,
  description: PropTypes.string,
  isRequired: PropTypes.bool,
  isDisable: PropTypes.bool,
  onValueChange: PropTypes.func
}

TextInput.defaultProps = {
  value: '',
  placeholder: null,
  errorMessage: null,
  description: null,
  isRequired: false,
  isDisable: false
}

export default TextInput
