import {useState, useEffect, useRef, useCallback} from 'react'

import PropTypes from 'prop-types'

export const useInput = ({initialValue, checkValue, isRequired}) => {
  const [input, setInput] = useState(initialValue || '')
  const [error, setError] = useState(null)
  const [isValueValid, setIsValueValid] = useState()

  const hasInputBeenUpdated = useRef(Boolean(initialValue))

  useEffect(() => {
    if (input !== '') {
      hasInputBeenUpdated.current = true
    }
  }, [input])

  useEffect(() => {
    setError(null)

    // Handle input error if form invalid
    if (checkValue) {
      const errorMessage = checkValue(input)

      setError(errorMessage)
      setIsValueValid(false)
    }

    // Handle errors messages if required input empty
    if (!input && isRequired && hasInputBeenUpdated.current) {
      setError('Ce champs est requis')
    }
  }, [input, isRequired, checkValue])

  const resetInput = useCallback(() => {
    setError(null)
    setInput(initialValue || '')
    setIsValueValid()
    hasInputBeenUpdated.current = false
  }, [initialValue])

  return [input, setInput, error, setIsValueValid, isValueValid, resetInput]
}

useInput.propTypes = {
  initialValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  checkValue: PropTypes.func,
  isRequired: PropTypes.bool
}

useInput.defaultProps = {
  checkValue() {},
  isRequired: false
}
