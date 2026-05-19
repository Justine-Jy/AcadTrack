class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server Error';

  // MySQL duplicate key error
  if (err.code === 'ER_DUP_ENTRY') {
    message = 'Duplicate entry. This record already exists.';
    statusCode = 400;
  }

  // MySQL not found error
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    message = 'Referenced record not found.';
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { AppError, asyncHandler, errorHandler };