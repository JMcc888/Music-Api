const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    // Log error
    console.error(err);
    // Default error object
    let error = {}
    error.statusCode = err.statusCode
    error.message = err.message

    // Mongoose bad id format
    if (err.name === "CastError") {
        const message = `Object ID ${err.value} is invalid`;
        error = new ErrorResponse(message, 400);
    };

    // Mongoose duplicate key
    // UNRESPONSIVE
    if (err.code === 11000) {
        console.log('woo');
        const message = `Duplicate field value entered: ${Object.keys(err.keyValue)}`;
        error = new ErrorResponse(message, 400);
    }

    // Other thing
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors);
        error = new ErrorResponse(message,  400);

    }

    // Send JSON response
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error',
    });
};

module.exports = errorHandler