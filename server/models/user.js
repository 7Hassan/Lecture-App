/* eslint-disable func-names */
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    maxlength: [15, 'First name is more than 15 characters'],
    minlength: [3, 'First name is less than 3 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    minlength: [3, 'Last name is less than 3 characters']

  },
  code: {
    type: Number,
    enum: [1230],
    required: [true, 'Code is required'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format.'],
    validate: {
      validator: validator.isEmail,
      message: 'Email is not valid'
    }
  },
  emailConfig: {
    type: Boolean,
    default: true
  },
  emailToken: String,
  expEmailToken: Date,
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password is less than 8 character'],
    select: false
  },
  passwordToken: String,
  expPasswordToken: Date,
  img: {
    type: String,
    default: 'https://firebasestorage.googleapis.com/v0/b/cera-1d79c.appspot.com/o/users%2Fdefault.webp?alt=media&token=a03185a4-0d2a-430c-bf29-8a4724975fbf&_gl=1*pnsezd*_ga*Njk0MTExMjMzLjE2OTc4MzQzODA.*_ga_CW55HF8NVT*MTY5Nzg3MTU5Mi4yLjEuMTY5Nzg3NDc2NS4xNy4wLjA.'
  },
  date: {
    type: Date,
    default: Date.now(),
  }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  this.date = Date.now() - 1000
  next()
})

userSchema.methods.isCorrectPass = async function (password, hashPassword) {
  return await bcrypt.compare(password, hashPassword)
}

userSchema.methods.isChangedPass = function (dateToken) {
  const dateUser = parseInt(this.date.getTime() / 1000) //? in S
  return (dateUser > dateToken)
}

userSchema.methods.createToken = function (validation) {
  const token = crypto.randomBytes(32).toString('hex') //? create a token
  if (validation == 'password') {
    this.passwordToken = crypto.createHash('sha256').update(token).digest('hex') //? Hash a token & save
    this.expPasswordToken = Date.now() + 30 * 60 * 1000 //? date now + 30 minutes
  }
  if (validation == 'email') {
    this.emailToken = crypto.createHash('sha256').update(token).digest('hex') //? Hash a token & save
    this.expEmailToken = Date.now() + 24 * 60 * 60 * 1000 //? date now + 24 hours
  }
  return token
}

let User = mongoose.model('users', userSchema)
module.exports = User;