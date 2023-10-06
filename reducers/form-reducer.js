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

  const validateField = (value, field) => field.validate ? field.validate(value) : true

  switch (action.type) {
    case 'SET_FIELD_VALUE': {
      const {fieldName, value} = action.payload
      const field = state.fields[fieldName]
      const sanitizedValue = field.sanitize ? field.sanitize(value) : value

      let {isValid} = field // Default to previous validity
      let {validationMessage} = field // Default to previous validation message

      // If sanitizedValue is empty, or if the field is marked for validation during a change, then it is validated
      if (sanitizedValue === '' || field.validateOnChange) {
        isValid = validateField(sanitizedValue, field)
        validationMessage = getValidationMessageForField(sanitizedValue, field, isValid)
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

    case 'ON_BLUR': {
      const {fieldName} = action.payload
      const field = state.fields[fieldName]
      const isValid = validateField(field.value, field)
      const validationMessage = getValidationMessageForField(field.value, field, isValid)

      return {
        ...state,
        fields: {
          ...state.fields,
          [fieldName]: {
            ...field,
            isValid,
            validationMessage
          }
        },
        isFormValid: checkFormValidity(state.fields)
      }
    }

    case 'VALIDATE_FIELD': {
      const {fieldName} = action
      const field = state.fields[fieldName]

      if (field.validateOnChange) {
        // Skip validation for fields with validateOnChange set to true
        return state
      }

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

    default:
      return state
  }
}

