import PropTypes from 'prop-types'

const SelectInput = ({label, value, name, options, errorMessage, description, isRequired, isDisable, onValueChange}) => {
  const inputState = errorMessage ? 'error' : ''

  return (
    <div className={`fr-select-group fr-select-group--${inputState}`}>
      <label className='fr-label'>{label}</label>
      {description && <span className='fr-hint-text fr-mb-2w'>{description}</span>}

      <select
        value={value}
        name={name}
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
    </div>
  )
}

SelectInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  description: PropTypes.string,
  errorMessage: PropTypes.string,
  isRequired: PropTypes.bool,
  onValueChange: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool
}

SelectInput.defaultProps = {
  errorMessage: null,
  description: null,
  isRequired: false,
  isDisabled: false
}

export default SelectInput
