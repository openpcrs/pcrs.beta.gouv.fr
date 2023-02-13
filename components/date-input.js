import PropTypes from 'prop-types'

const DateInput = ({label, value, errorMessage, description, isRequired, isDisabled, onValueChange}) => {
  const inputState = errorMessage ? 'error' : ''

  return (
    <div className='fr-input-group'>
      <label className='fr-label' htmlFor='text-input-calendar'>{label}</label>
      {description && <span className='fr-hint-text fr-mb-2w'>{description}</span>}

      <div className='fr-input-wrap fr-fi-calendar-line'>
        <input
          className={`fr-input fr-input--${inputState}`}
          type='date'
          value={value}
          name={name}
          required={isRequired}
          disabled={isDisabled}
          onChange={e => onValueChange(e.target.value)}
        />
      </div>

      {errorMessage && <p id='text-input-error-desc-error' className='fr-error-text'>{errorMessage}</p>}
    </div>
  )
}

DateInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  name: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
  description: PropTypes.string,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onValueChange: PropTypes.func.isRequired
}

DateInput.defaultProps = {
  value: '',
  errorMessage: null,
  description: null,
  isRequired: false,
  isDisabled: false
}

export default DateInput
