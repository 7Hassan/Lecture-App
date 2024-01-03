const express = require('express')
const Router = express.Router()
const func = require('../controller/api')



Router.route('/tables').get(func.tables).post(func.protectAPI, func.add)
Router.use(func.protectAPI)
Router.route('/user').get(func.user)
Router.route('/table/:id').get(func.getLec).put(func.edit).delete(func.delete)

module.exports = Router
