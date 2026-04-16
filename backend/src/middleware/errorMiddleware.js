/**
 * Centralized Error Handling Middleware
 * Ensures consistent error responses across the API
 */
class ErrorMiddleware {
  
  /**
   * Global error handler
   */
  handleError(err, req, res, next) {
    // Default error
    let statusCode = err.status || 500;
    let message = err.message || 'Internal Server Error';
    let errors = err.errors || [];

    // Handle specific error types
    if (err.name === 'ValidationError') {
      statusCode = 400;
      message = 'Validation Error';
    } else if (err.name === 'UnauthorizedError') {
      statusCode = 401;
      message = 'Unauthorized';
    } else if (err.name === 'ForbiddenError') {
      statusCode = 403;
      message = 'Forbidden';
    } else if (err.code === 'ER_DUP_ENTRY') {
      statusCode = 409;
      message = 'Duplicate entry';
    }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('🔥 Error:', {
        statusCode,
        message,
        stack: err.stack,
        timestamp: new Date().toISOString()
      });
    } else {
      // In production, log to file/monitoring service
      console.error(`[${new Date().toISOString()}] ${statusCode} - ${message}`);
    }

    // Send response
    res.status(statusCode).json({
      success: false,
      message,
      ...(errors.length > 0 && { errors }),
      ...(process.env.NODE_ENV === 'development' && { 
        stack: err.stack,
        details: err 
      })
    });
  }

  /**
   * Catch 404 errors for undefined routes
   */
  notFound(req, res, next) {
    const error = new Error(`Route ${req.originalUrl} not found`);
    error.status = 404;
    next(error);
  }

  /**
   * Async error wrapper (avoids try-catch in every controller)
   */
  asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}

module.exports = new ErrorMiddleware();