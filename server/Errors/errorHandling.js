
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.message = err.message || "Network response is't ok"

  if (err.name == 'ValidationError') return validationMongoErr(err, res)
  if (err.name === 'MongoServerError' && err.code === 11000) {
    const key = Object.values(err.keyValue)[0]
    return res.status(401).json({ msg: `${key} is used`, success: false })
  }
  res.status(err.statusCode).json({ msg: err.message, success: false })
}
module.exports = errorHandler

function validationMongoErr(err, res) {
  const validationErrors = Object.values(err.errors).map(err => err.message);
  res.status(401).json({ msg: validationErrors[0], success: false })
}

