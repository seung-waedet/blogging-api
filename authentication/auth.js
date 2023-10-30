const mongoose = require('mongoose')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const JWTStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const userModel = require('../models/userModel')

require('dotenv').config()

passport.use(
    'jwt',
    new JWTStrategy(
        {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        },

        async(token, done) => {
            try {
                return done(null, token.user)
            } catch(err) {
                done(err)
            }
        }
    )
)
passport.use(
    'signup',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
    
        async function (req, email, password, done) {
            try {
                const userInfo = req.body
            
                const {first_name, last_name} = userInfo

                const user = await userModel.create({first_name, last_name, email, password})

                return done(null, user)
            } catch(err) {
                if (err instanceof mongoose.Error.ValidationError) {
                    err.status = 400
                }
                done(err)
            }
        }
    )
)

passport.use(
    'login',
    new localStrategy(
        {
            "usernameField": "email",
            "passwordField": "password",
            "passReqToCallback": true
        },

        async function(req, email, password, done) {
            try {
                const user = await userModel.findOne({email})
                if (!user) return done(null, false, {message: "User not found"})

                const validate = await user.isValidPassword(password)
                
                if (!validate) return done(null, false, {message: "Password incorrect"})

                return done(null, user, {message: "Login successful"})
            } catch(err) {
                console.log(err)
                return done(err)
            }
        }
    )
)