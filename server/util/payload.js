class ValidationError extends Error {
  constructor(validationDetails) {
    super('Invalid payload')
    this.validation = validationDetails
  }
}

function validatePayload(payload, schema) {
  const {error, value} = schema.validate(payload, {
    abortEarly: false,
    convert: false
  })

  if (error) {
    throw new ValidationError(error.details)
  }

  return value
}

export {ValidationError, validatePayload}

