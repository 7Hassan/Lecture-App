const express = require('express')
const limitReq = require('express-rate-limit')
const Router = express.Router()
const func = require('../controller/auth')

const limiter = limitReq({
  max: 1,
  windowMs: 1000 * 30,
  message: { msg: 'Try after 30 seconds', success: false }
})

const limiter2 = limitReq({
  max: 3,
  windowMs: 1000 * 60 * 60 * 24,
  message: { msg: 'Try after 24 hours', success: false }
})

const limiter3 = limitReq({
  max: 4,
  windowMs: 1000 * 60 * 60 * 24,
  message: { msg: 'Try after 24 hours', success: false }
})

Router.use(func.protectAuth)
Router.route('/userTemp').get(func.userTemp)
Router.route('/signup').post(func.signUp)
Router.route('/login').post(func.login).put(limiter2, limiter, func.forgetPass)
Router.route('/login/verify').post(limiter3, limiter, func.changePass)
module.exports = Router