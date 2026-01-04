const successResponse = (res, data = null, message = 'success') => {
  res.json({
    code: 200,
    message,
    data
  })
}

const errorResponse = (res, message = 'error', code = 500) => {
  res.json({
    code,
    message,
    data: null
  })
}

module.exports = {
  successResponse,
  errorResponse
}
