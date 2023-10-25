export function checkFormValidity(fields) {
  return Object.values(fields).every(field =>
    field.isValid || (!field.value && !field.isRequired)
  )
}

export default function formReducer(state, action) {
  const getValidationMessageForField = (value, field, isValid) => {
    if (!isValid && value) {
      return field.getValidationMessage(value)
    }

    if (!value && field.isRequired) {
      return 'Ce champ est requis'
    }

    return null
  }

  const validateField = (value, field) => {
    if (value === '' && field.isRequired) {
      return false
    }

    return field.validate ? field.validate(value) : true
  }

  switch (action.type) {
    case 'SET_FIELD_VALUE': {
      const {fieldName, value} = action.payload
      const field = state.fields[fieldName]
      const sanitizedValue = field.sanitize ? field.sanitize(value) : value
      const isValid = validateField(sanitizedValue, field)

      let {validationMessage} = field // Default to previous validation message

      // If sanitizedValue is empty, or if the field is marked for validation during a change, then it is validated
      if (sanitizedValue === '' || field.validateOnChange) {
        validationMessage = getValidationMessageForField(sanitizedValue, field, isValid)
      } else if (sanitizedValue.length > 0 && isValid) { // Clear error on change
        validationMessage = null
      }

      const updatedFields = {
        ...state.fields,
        [fieldName]: {
          ...field,
          value: sanitizedValue,
          isValid,
          validationMessage
        }
      }

      return {
        ...state,
        fields: updatedFields,
        isFormValid: checkFormValidity(updatedFields)
      }
    }

    case 'VALIDATE_FIELD': {
      const {fieldName} = action
      const field = state.fields[fieldName]

      const isValid = validateField(field.value, field)
      const validationMessage = getValidationMessageForField(field.value, field, isValid)

      const updatedFields = {
        ...state.fields,
        [fieldName]: {
          ...field,
          isValid,
          validationMessage
        }
      }

      return {
        ...state,
        fields: updatedFields,
        isFormValid: checkFormValidity(updatedFields)
      }
    }

    default: {
      return state
    }
  }
}

