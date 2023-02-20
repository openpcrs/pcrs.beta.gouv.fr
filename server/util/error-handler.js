function errorHandler(err, req, res, _next) {
  if (err) {
    const statusCode = err.statusCode || 500
    const exposeError = statusCode !== 500

    res
      .status(statusCode)
      .send({
        code: statusCode,
        message: exposeError ? err.message : 'Une erreur inattendue est survenue.',
        validationErrors: err.details
      })

    if (statusCode === 500) {
      console.log(err)
    }
  }
}

export default errorHandler

