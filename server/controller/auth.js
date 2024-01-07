const User = require('../models/user')
const crypto = require('crypto')
const catchError = require('../Errors/catch')
const AppError = require('../Errors/classError')
const helper = require('./helperFunc')
// const Email = require('./email')

exports.checkEmail = catchError(async (req, res, next) => {
  const email = req.body.email
  const user = await User.findOne({ email })
  if (user) res.status(200).send(user.firstName)
  else res.status(201).send(false)
})

exports.isEmailConfig = catchError(async (req, res, next) => {
  const { user, time } = await helper.testJwtToken(req, res)
  if (user && !user.isChangedPass(time)) {
    req.user = user
    if (!user.emailConfig) return next()
    req.flash('toast', 'Your Email is confirmed')
    res.status(300).redirect('/')
  } else {
    req.flash('errors', 'You aren\'t Register')
    res.status(401).redirect('/')
  }
})

exports.protectAuth = async (req, res, next) => {
  const { user, time } = await helper.testJwtToken(req, res, next)
  if (!user || user.isChangedPass(time)) return next()
  next(new AppError('You are register', 401))
}

exports.verify = async (req, res, next) => {
  const token = crypto.createHash('sha256').update(req.params.token).digest('hex')
  const user = await User.findOne({ emailToken: token, expEmailToken: { $gt: Date.now() } })
  if (!user) return next(new AppError('Email Date is expired', 404))
  user.emailConfig = true
  user.emailToken = undefined
  user.expEmailToken = undefined
  await user.save()
  req.flash('success', 'verification Email')
  res.status(200).redirect('/')
  helper.sendSocket('emailConfirmed')
  const url = `${req.protocol}://${req.get('host')}`
  new Email(req.user, url).welcome()
}

exports.signUp = catchError(async (req, res, next) => {
  const data = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    code: req.body.code,
    email: req.body.email,
    password: req.body.password,
  }
  const newUser = await User.create(data)
  const { firstName, lastName, img } = newUser
  const jwtToken = helper.createJwtToken(newUser._id)
  res.cookie('jwt', jwtToken, helper.cookieOptions).status(201)
    .json({ success: true, data: { firstName, lastName, img } })
  await new Email(newUser.name, newUser.email).welcome()
})

exports.login = catchError(async (req, res, next) => {
  const { email, password } = req.body
  if (!email) return next(new AppError('Email required', 401))
  if (!password) return next(new AppError('Password required', 401))
  if (password.length < 8) return next(new AppError('Incorrect Password', 401))
  const user = await User.findOne({ email }).select('+password')
  if (!user) return next(new AppError('Incorrect Email', 401))
  const isMatch = await user.isCorrectPass(password, user.password)
  if (!isMatch) return next(new AppError('Incorrect Password', 401))
  const jwtToken = helper.createJwtToken(user._id)
  const { firstName, lastName, img } = user;
  res.cookie('jwt', jwtToken, helper.cookieOptions).status(200).json({ success: true, data: { firstName, lastName, img } })
})

exports.forgetPass = catchError(async (req, res, next) => {
  const user = await User.findOne({ userName: req.body.userName })
  if (!user) return next(new AppError('Incorrect Email', 401))
  const code = user.createCode()
  await user.save()
  await new Email(user.name, user.email, code).codeVerification()
  res.status(201).send({ success: true, data: {} })
})

exports.changePass = catchError(async (req, res, next) => {
  const { code, newPassword } = req.body;
  const token = crypto.createHash('sha256').update(code).digest('hex')
  const user = await User.findOne({ code: token, codeEx: { $gt: Date.now() } }).select('+password +code +codeEx')
  if (!user) return next(new AppError('Invalid Code', 404))
  user.password = newPassword
  user.code = undefined
  user.codeEx = undefined
  await user.save()
  const jwtToken = helper.createJwtToken(user._id)
  res.cookie('jwt', jwtToken, helper.cookieOptions).status(200).json({ success: true, data: user })
})

