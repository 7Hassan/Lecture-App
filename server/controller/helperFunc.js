const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const AppError = require('../Errors/classError')
const WebSocket = require('ws');
const multer = require('multer')
const sharp = require('sharp')


exports.cookieOptions = {
  expires: new Date(Date.now() + process.env.JWT_COOKIE_EXP * 24 * 60 * 60 * 1000),
  httpOnly: true,
  secure: true,
  sameSite: 'None',
  // domain: ".vercel.app"
};

exports.createJwtToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRED })


exports.testJwtToken = async (req) => {
  let cookie, user, time
  if (req.cookies) cookie = req.cookies.jwt
  if (!cookie) return { user, time }
  if (cookie.split('.').length !== 3) return { user, time }
  await promisify(jwt.verify)(cookie, process.env.JWT_SECRET)
    .then(async (decoded) => {
      time = decoded.iat
      user = await User.findOne({ _id: decoded.id })
    }).catch((err) => 0)
  return { user, time }
}

exports.sendSocket = (data) => wss.clients.forEach((client) => (client.readyState === WebSocket.OPEN) ? client.send(data) : 0)

exports.pageObject = (title, req) => {
  return {
    title: title,
    errors: req.flash('errors'),
    warning: req.flash('warning'),
    success: req.flash('success'),
    toast: req.flash('toast'),
  }
}

const multerStorage = multer.memoryStorage()
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true)
  else cb(new AppError('Please upload only images', 400), false)
}

exports.upload = multer({ storage: multerStorage, fileFilter: multerFilter })

exports.sharpImg = (req) => sharp(req.file.buffer)
  .resize(500, 500)
  .toFormat('jpeg')
  .jpeg({ quality: 90 })
  .toFile(`public/imgs/users/${req.file.filename}`)


exports.conflictTime = (start, end, lectures) => {
  return lectures.some(lecture => {
    return (
      (start >= lecture.start && start < lecture.end) ||
      (end > lecture.start && end <= lecture.end) ||
      (start <= lecture.start && end >= lecture.end)
    );
  });
}


