import PropTypes from 'prop-types'

const SelectInput = ({label, value, ariaLabel, options, errorMessage, description, isRequired, isDisabled, onValueChange}) => {
  const inputState = errorMessage ? 'error' : ''

  return (
    <div className={`fr-select-group fr-select-group--${inputState}`}>
      <label className={`fr-label ${isRequired ? 'required-label' : ''}`}>{label}</label>
      {description && <span className='fr-hint-text fr-mb-2w'>{description}</span>}

      <select
        value={value}
        aria-label={ariaLabel}
        className={`fr-select fr-select--${inputState}`}
        required={isRequired}
        disabled={isDisabled}
        onChange={e => onValueChange(e.target.value)}
      >
        <option
          disabled
          hidden
          value=''
        >
          Selectionnez une option
        </option>

        {options.map(({value, label, isDisabled}) => (
          <option
            key={value}
            value={value}
            disabled={isDisabled}
          >
            {label}
          </option>
        ))}
      </select>

      {errorMessage && <p className='fr-error-text'>{errorMessage}</p>}

      <style jsx>{`
        .required-label::after {
          content: '*';
          margin-left: 5px
        }
      `}</style>
    </div>
  )
}

SelectInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  ariaLabel: PropTypes.string,
  options: PropTypes.array.isRequired,
  description: PropTypes.string,
  errorMessage: PropTypes.string,
  isRequired: PropTypes.bool,
  onValueChange: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool
}

SelectInput.defaultProps = {
  label: '',
  value: '',
  ariaLabel: '',
  errorMessage: null,
  description: null,
  isRequired: false,
  isDisabled: false
}

export default SelectInput
