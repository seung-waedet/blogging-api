const express = require('express')
const userRoute = express.Router()
const userController = require('../controllers/user.controller')
const userValidator = require('../validators/user.validator')
const passport = require('passport')

userRoute.post('/signup', userValidator, passport.authenticate('signup', {session: false}), userController.signup)
userRoute.post('/login', userController.login)

module.exports = userRoute