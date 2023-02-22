import {useCallback} from 'react'
import PropTypes from 'prop-types'
import Autocomplete from 'react-autocomplete'

import Loader from '@/components/loader.js'

const AutocompleteInput = ({
  label,
  value,
  description,
  placeholder,
  ariaLabel,
  errorMessage,
  results,
  customItem,
  isRequired,
  isDisabled,
  isLoading,
  onValueChange,
  onSelectValue,
  getItemValue
}) => {
  const inputState = errorMessage ? 'error' : ''

  // Custom autocomplete input
  const customInput = props => (
    <div className={`fr-grid-row fr-search-bar fr-input-group--${inputState}`} role='search'>
      <label className='fr-col-12'>
        {label}
        {description && <span className='fr-hint-text fr-mb-2w fr-mt-0'>{description}</span>}
      </label>

      <input
        type='search'
        aria-label={ariaLabel}
        required={isRequired}
        className={`fr-input fr-input--${inputState}`}
        placeholder={placeholder}
        disabled={isDisabled}
        {...props}
      />

      {errorMessage && <p id='text-input-error-desc-error' className='fr-error-text'>{errorMessage}</p>}
    </div>
  )

  // Custom suggestions dropdown menu
  const customMenu = useCallback((items, value) => (
    <div className={value.length > 0 ? 'menu fr-mt-1w' : 'hidden'}>
      {isLoading && items.length === 0 ? (
        <div className='fr-grid-row fr-grid-row--center fr-p-2w'><Loader size='small' /></div>
      ) : (items.length === 0 ? (
        <div className='item'>Aucun résultat</div>
      ) : items)}

      <style jsx>{`
        .menu {
          box-shadow: 2px 12px 23px 2px rgba(0,0,0,0.23);
        }

        .hidden {
          display: none;
        }
      `}</style>
    </div>
  ), [isLoading])

  return (
    <Autocomplete
      value={value}
      getItemValue={getItemValue}
      items={results}
      renderItem={(item, isHighlighted) => customItem(item, isHighlighted)}
      renderMenu={customMenu}
      renderInput={customInput}
      wrapperStyle={{width: '100%'}}
      onChange={event => onValueChange(event.target.value)}
      onSelect={onSelectValue}
    />
  )
}

AutocompleteInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  description: PropTypes.string,
  placeholder: PropTypes.string,
  ariaLabel: PropTypes.string,
  errorMessage: PropTypes.string,
  results: PropTypes.array.isRequired,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  customItem: PropTypes.func.isRequired,
  getItemValue: PropTypes.func.isRequired,
  onValueChange: PropTypes.func.isRequired,
  onSelectValue: PropTypes.func.isRequired
}

AutocompleteInput.defaultProps = {
  label: '',
  value: '',
  description: null,
  placeholder: null,
  ariaLabel: null,
  errorMessage: null,
  isRequired: false,
  isDisabled: false
}

export default AutocompleteInput