import {useState, useCallback} from 'react'
import PropTypes from 'prop-types'

const useErrors = initialState => {
  const [errors, setErrors] = useState(initialState)

  const setError = useCallback((name, message) => {
    setErrors(errors => ({...errors, [name]: message}))
  }, [])

  const clearError = useCallback(name => {
    setErrors(errors => ({...errors, [name]: ''}))
  }, [])

  return [errors, setError, clearError]
}

useErrors.propTypes = {
  initialState: PropTypes.object.isRequired
}

export default useErrors
