const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console/file
  logger.error(`${err.name || 'Error'}: ${err.message}`, {
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body
  });

  // Mongoose bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = { status: 404, message };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value entered: '${field}'. Please use another value.`;
    error = { status: 400, message };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { status: 400, message };
  }

  // Default response
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    errors: err.errors ? Object.keys(err.errors).map(key => ({
      field: key,
      message: err.errors[key].message
    })) : undefined
  });
};

module.exports = errorHandler;
