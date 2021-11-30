const express = require('express')
const { registerUser, loginUser, getMe, forgotPassword, resetPassword } = require('../controllers/auth')
const {protect} = require('../middleware/auth')
const router = express.Router();

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/me').get(protect, getMe)
router.route('/forgotpassword').post(forgotPassword)
router.route('/resetpassword/:resetToken').put(resetPassword)

module.exports = router