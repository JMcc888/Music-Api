const jwt = require('jsonwebtoken')
const asyncHandler = require('./asynchandler')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/user')

// Protect Routes - require login
exports.protect = asyncHandler(async (req, res, next) => {
    // Initialize Token Variable
    let token;
    // Check if token was passed in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies.token) {
        token = req.cookies.token
    }
    // Check if token was passed in cookies

    // Verify token
    if (!token) {
        return next(new ErrorResponse('You must login to access that resource', 401))
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decodedToken)
        req.user = await User.findById(decodedToken.id)
        next()
    } catch (err) {
        console.log('Error verifying token')
        console.error(err)
        return next(new ErrorResponse('Not authorized to access this resource', 401))
    }
    // Continue
})

// Grant access to certain roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`Role ${req.user.role} is not authorized to access this resource`, 403))
        }
        next();
    }
}