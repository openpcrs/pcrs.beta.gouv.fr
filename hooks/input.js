import {useState, useEffect} from 'react'

import PropTypes from 'prop-types'

export const useInput = ({initialValue, checkValue, isRequired}) => {
  const [input, setInput] = useState(initialValue || '')
  const [error, setError] = useState(null)
  const [isValueValid, setIsValueValid] = useState(true)

  useEffect(() => {
    setError(null)

    // Handle input error if form invalid
    if (checkValue) {
      const errorMessage = checkValue(input)

      setError(errorMessage)
      setIsValueValid(false)
    }

    // Handle errors messages if required input empty
    if (!input && isRequired) {
      setError('Ce champs est requis')
    }
  }, [input, isRequired, checkValue])

  return [input, setInput, error, setIsValueValid, isValueValid]
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
