import {useState, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import {uniqueId} from 'lodash-es'

import colors from '@/styles/colors.js'

import Loader from '@/components/loader.js'

const AutocompleteInput = ({
  label,
  value,
  description,
  placeholder,
  ariaLabel,
  errorMessage,
  isRequired,
  isDisabled,
  onInputChange,
  onSelectValue,
  results,
  customItem,
  isLoading
}) => {
  const inputState = errorMessage ? 'error' : ''
  const wrapperRef = useRef(null)

  const [activeSuggestion, setActiveSuggestion] = useState(0) // State to handle selected/focus item
  const [isSuggestionsMenuOpen, setIsSuggestionsMenuOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const onValueChange = e => {
    onInputChange(e.target.value)

    setActiveSuggestion(0)
    setIsSuggestionsMenuOpen(true)
  }

  const onKeyDown = event => {
    if (event.key === 'Enter' && results.length > 0) {
      setActiveSuggestion(0)
      setIsSuggestionsMenuOpen(false)
    } else if (event.key === 'ArrowUp') {
      if (activeSuggestion === 0) {
        return
      }

      setActiveSuggestion(activeSuggestion - 1)
    } else if (event.key === 'ArrowDown') {
      if (activeSuggestion - 1 === results.length) {
        return
      }

      setActiveSuggestion(activeSuggestion + 1)
    } else if (event.key === 'Tab' && isSuggestionsMenuOpen && !isFocused) {
      // Hide suggestions when tabbing away from the input
      setIsSuggestionsMenuOpen(false)
    }
  }

  const onFocus = () => {
    setIsFocused(true)
  }

  useEffect(() => {
    // CLose suggestions menu on click outside
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsSuggestionsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [wrapperRef])

  return (
    <div className='search-wrapper'>
      <div className={`fr-grid-row fr-search fr-input-group--${inputState}`}>
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
          value={value}
          onChange={onValueChange}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
        />

        {errorMessage && <p id='text-input-error-desc-error' className='fr-error-text'>{errorMessage}</p>}
      </div>

      {(isSuggestionsMenuOpen && value) && (
        isLoading ? (
          <div className='fr-grid-row fr-grid-row--center fr-p-2w fr-mt-1w fr-p-0 menu'><Loader size='small' /></div>
        ) : (
          results.length > 0 && (
            <ul ref={wrapperRef} className='fr-mt-1w fr-p-0 menu' role='listbox'>
              {results.map((item, index) => (

                <li
                  key={uniqueId()}
                  className={`${index === activeSuggestion ? 'suggestion-active' : ''} fr-p-2w`}
                  tabIndex={0} // Allow keyboard focus
                  aria-selected={index === activeSuggestion} // Indicate selected item for screen readers
                  onClick={() => {
                    setActiveSuggestion(0)
                    setIsSuggestionsMenuOpen(false)
                    onSelectValue(item)
                  }}
                  onKeyDown={event => {
                  // Allow to select item with "enter" key if isFocused
                    if (event.key === 'Enter') {
                      setActiveSuggestion(0)
                      setIsSuggestionsMenuOpen(false)
                      onInputChange(event.target.textContent)
                      onSelectValue(item)
                    }
                  }}
                >
                  {customItem(item)}
                </li>
              ))}
            </ul>
          ))
      )}

      <style jsx>{`
        .required-label::after {
          content: '*';
          margin-left: 5px
        }

        .search-wrapper {
          position: relative;
          z-index: 2;
        }

        .menu {
          box-shadow: 2px 12px 23px 2px rgba(0,0,0,0.23);
          border-radius: 0 0 5px 5px;
          background: white;
          position: absolute;
          left: 0;
          right: 0;
        }

        .menu li {
          border-bottom: solid 2px ${colors.grey900};
        }

        .suggestion-active,
        .suggestions li:hover {
          background-color: ${colors.info425};
          color: white;
          font-weight: bold;
          cursor: pointer;
        }

        .menu li:last-child{
          border-bottom: none;
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
  onInputChange: PropTypes.func.isRequired,
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
