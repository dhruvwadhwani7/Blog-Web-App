// Middleware for error handling
module.exports = (err, req, res, next) => {
  // TODO: Handle errors
  res.status(500).json({ error: err.message })
}
