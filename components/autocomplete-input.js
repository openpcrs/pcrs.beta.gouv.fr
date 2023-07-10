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
    <div className={`fr-grid-row fr-search fr-input-group--${inputState}`} role='search'>
      <label className='fr-col-12'>
        <div className={isRequired ? 'required-label' : ''} >{label}</div>

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

      <style jsx>{`
        .required-label::after {
          content: '*';
          margin-left: 5px
        }
      `}</style>
    </div>
  )

  // Custom suggestions dropdown menu
  const customMenu = useCallback((items, value) => (
    <div className={value.length > 0 ? 'menu fr-mt-1w' : 'hidden'}>
      {isLoading && items.length === 0 ? (
        <div className='fr-grid-row fr-grid-row--center fr-p-2w'><Loader size='small' /></div>
      ) : (items.length === 0 ? (
        <div className='item fr-p-2w'>Aucun résultat</div>
      ) : items)}

      <style jsx>{`
        .menu {
          position: absolute;
          left: 0;
          right: 0;
          box-shadow: 2px 12px 23px 2px rgba(0,0,0,0.23);
          border-radius: 0 0 5px 5px;
          background: white;
        }

        .hidden {
          display: none;
        }
      `}</style>
    </div>
  ), [isLoading])

  return (
    <div className='search-input-wrapper'>
      <Autocomplete
        value={value}
        getItemValue={getItemValue}
        items={results}
        renderItem={(item, isHighlighted) => customItem(item, isHighlighted)}
        renderMenu={customMenu}
        renderInput={customInput}
        wrapperStyle={{width: '100%'}}
        onChange={onValueChange}
        onSelect={onSelectValue}
      />

      <style jsx>{`
        .search-input-wrapper {
          position: relative;
        }
      `}</style>
    </div>
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
