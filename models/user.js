const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please add a username'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Please enter an email address'],
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/],
        unique: true,
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        // admin will be assigned manually
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 10,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createAt: {
        type: Date,
        default: Date.now
    }
})

// ======================
// MIDDLEWARE
// ======================
UserSchema.pre('save', async function (next) {
    // Generate salt
    const salt = await bcrypt.genSalt(10)
    // Hash password
    this.password = await bcrypt.hash(this.password, salt)
})

// ===============
// METHOD   
// ===============
// Sign and return JWT
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
    })
}

// Match user password
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
    // Returns boolean
}

module.exports = mongoose.model('User', UserSchema)