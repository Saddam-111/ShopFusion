export class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorMiddleware = (err, req, res, next) => {
  let error = { ...err };
  error.statusCode = err.statusCode || 500;
  error.message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV === "development") {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      stack: error.stack
    });
  } else {
    res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
  }
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};