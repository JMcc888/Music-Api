const crypto = require('crypto')
const User = require('../models/user')
const ErrorHandler = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asynchandler')
const sendEmail = require('../utils/sendemail')

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

// GET /api/v1/auth/logout (Logout)
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
  })

  res.status(200).json({
    success: true,
    data: {},
  });
});



// GET /api/v1/auth/me (Current User)
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});



// POST /api/v1/auth/forgotpassword (Current User)
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({email: req.body.email});

  if (!user) {
    return next(new ErrorHandler('No user found with that email', 404))
    // Bad Security Will Change Later
  }

  // Get a reset token
  const resetToken = user.getResetPasswordToken()

  // Save the user
  await user.save({validationBeforeSave: false})

 

  // Create reset url
  // https://localhost:3000/api/v1/resetpassword/:resetToken
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`


  // Create message
  const message = `You are receiving this email because someone has requested the reset of a password at Music Api. Please make a PUT request to: \n\n ${resetUrl}`

   // Send email
   try {
    await sendEmail({
      recipient: user.email,
      subject: "Password Reset Token",
      message
    })
    res.status(200).json({
      success: true,
      data: "Email sent"
    })

  } catch (err) {
    console.log(err)

    // Clear reset password fields from DB
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save({ validateBeforeSave: false})
    return next(new ErrorHandler('Problem sending email', 500))
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// PUT /api/v1/auth/resetpassword/:resetToken (Current User)
exports.resetPassword = asyncHandler(async (req, res, next) => {

  // Get hashed token
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex')

  // Find user with resetPasswordToken that matches the provided token, after hashing

  // Make sure token hasn't expired
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now()
    }
  });

  if(!user) {
    return next(new ErrorHandler('Invalid token or expired', 400))
  }

  // Set new password
  user.password = req.body.password // automatically hashed by middleware
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res)
});

// PUT /api/v1/auth/updatedetails (Current User)
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    username: req.body.username,
    email: req.body.email
  }



  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});


// PUT /api/v1/auth/updatepassword (Current User)
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Verify password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorHandler('Incorrect current password', 401))
  }

  user.password = req.body.newPassword
  await user.save()


  sendTokenResponse(user, 200, res)
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