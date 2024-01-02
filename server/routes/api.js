const express = require('express')
const Router = express.Router()
const func = require('../controller/api')
// const { protectAPI } = require('../controller/api')


// Router.use(protectAPI)

Router.route('/user').get(func.protectAPI, func.user)
Router.route('/tables').get(func.tables).post(func.add)
Router.route('/table/:id').get(func.edit).delete(func.delete)



module.exports = Router
