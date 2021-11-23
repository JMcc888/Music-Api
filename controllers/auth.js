const User = require('../models/user')
const ErrorHandler = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asynchandler')

// POST /api/v1/auth/register
exports.registerUser = asyncHandler(async (req, res, next) => {
    const {username, email, password, role} = req.body;

    const user = await User.create({
        username,
        email,
        password,
        role
    });

    // Create JWT Token
    sendTokenResponse(user, 201, res);
  //   const token = user.getSignedJwtToken()


  // res.status(201).json({
  //     success: true,
  //     data: user.username,
  //     token
  // });
  
});

// POST /pai/v1/auth/login
exports.loginUser = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body;

    // Ensure both fields are entered
    if(!email || !password) {
      return next(new ErrorHandler('Please provide an email and password', 400))
    }

    // check for user
    // credentials to prevent bruteforce
    const user = await User.findOne({email}).select('+password');

    if (!user) {
      return next(new ErrorHandler('Invalid credintials', 401))
    }

    // See if entered password matches DB password
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return next(new ErrorHandler('Invalid Credentials', 401))
    }

    sendTokenResponse(user, 200, res);
});

// GET /api/v1/auth/me (Current User)
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// ===================
// Utility Functions
// ===================
// Get token from model, create cookie, and send response
const sendTokenResponse = (user, status, res) => {
      // Create JWT Token
      const token = user.getSignedJwtToken()

      // cookie options
      const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60),
        httpOnly: true
      }

      if (process.env.NODE_ENV === 'production') {
        options.secure = true
      }

      res
      .status(status)
      .cookie('token', token, options).
      json({
          success: true,
          token
      });
}