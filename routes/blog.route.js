const express = require('express')
const blogRoute = express.Router()
const passport = require('passport')
const articleValidator = require('../validators/article.validator')
const blogController = require('../controllers/blog.controller')

blogRoute.get("/", blogController.getAllArticles)

blogRoute.get("/article/:idOrTitle", blogController.getArticleByIdOrTitle)

blogRoute.get('/articles', passport.authenticate('jwt', {session: false}), blogController.getDraftsAndPublished)

blogRoute.post('/create-article', articleValidator, passport.authenticate('jwt', {session: false}), blogController.createArticle)

blogRoute.patch('/article/:id', passport.authenticate('jwt', {session: false}), blogController.updateArticle)

blogRoute.patch('/publish/:id', passport.authenticate('jwt', {session: false}), blogController.updateDraftToPublished)

blogRoute.delete('/article/:id', passport.authenticate('jwt', {session: false}), blogController.deleteArticle)

module.exports = blogRoute