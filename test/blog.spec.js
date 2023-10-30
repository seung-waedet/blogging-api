const request = require('supertest')
const app = require('../index')
const { connect } = require('./database')
const userModel = require('../models/userModel')
const articleModel = require('../models/articleModel')
const articles = require('../fixtures/articles.json')
const users = require('../fixtures/users.json')


describe('authenticate a user', () => {
    let conn, token, _id1, id2;

    beforeAll(async () => {
        conn = await connect()
        
        await userModel.create(users[0])

        const response = await request(app).post('/api/login')
        .set('content-type', 'application/json')
        .send({email: users[0].email, password: users[0].password})

        token = response.body.token
    })

    afterAll(async () => {
        await conn.disconnect()
    })

    it('logged in users(owner) should be able to create articles - POST request /api/blog/create-article', async () => {
        const response = await request(app).post('/api/blog/create-article')
        .set('Authorization', `Bearer ${token}`)
        .send(articles[0])
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("status")
        expect(response.body).toHaveProperty("message")
        expect(response.body).toHaveProperty("article")
        expect(response.body.status).toBe(true)
        expect(response.body.message).toBe("Article creation successful")
        _id1 = response.body.article._id
    })

    it('logged in users(owner) should be able to create articles - POST request /api/blog/create-article', async () => {
        const response = await request(app).post('/api/blog/create-article')
        .set('Authorization', `Bearer ${token}`)
        .send(articles[1])
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("status")
        expect(response.body).toHaveProperty("message")
        expect(response.body).toHaveProperty("article")
        expect(response.body.status).toBe(true)
        expect(response.body.message).toBe("Article creation successful")
        _id2 = response.body.article._id
    })

    it('logged in users(owner) should be able to edit articles - PATCH request /api/blog/article/id', async () => {
        const response = await request(app).patch(`/api/blog/article/${_id1}`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({body: "Positioning can seem daunting at first for everyone new to css. In this article I'll explain the concept in the simplest way possible"})
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("status")
        expect(response.body).toHaveProperty("article")
        expect(response.body).toHaveProperty("message")
        expect(response.body.status).toBe(true)
        expect(response.body.message).toBe("Update successful")
    })

    it('logged in users(owner) should be able to get all articles in all states - GET request /api/blog/articles', async () => {
        const response = await request(app).get(`/api/blog/articles`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("status")
        expect(response.body).toHaveProperty("articles")
        expect(response.body.articles.length).toBe(2)
        expect(response.body.status).toBe(true)
    })

    it('logged in users(owner) should be able to filter articles by draft state - GET request /api/blog/articles', async () => {
        const response = await request(app).get(`/api/blog/articles?state=draft`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("status")
        expect(response.body).toHaveProperty("articles")
        expect(response.body.articles.length).toBe(2)
        expect(response.body.status).toBe(true)
    })

    it('logged in users(owner) should be able to filter articles by published state - GET request /api/blog/articles', async () => {
        const response = await request(app).get(`/api/blog/articles?state=published`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("status")
        expect(response.body).toHaveProperty("articles")
        expect(response.body.status).toBe(true)
        expect(response.body.articles).toEqual([])
    })

    it(`return an error if article with such title hasn't been published - GET request /api/blog/article/:idOrTitle`, async () => {
        const title = "understanding-css-positioning"
        const response = await request(app).get(`/api/blog/article/${title}`)
        .set('content-type', 'application/json')
        
        expect(response.status).toBe(404)
        expect(response.body.message).toBe(`Aritlce hasn't been published`)
        expect(response.body.status).toBe(false)
    })


    it('logged in users(owner) should be able to update draft to publish - PATCH request /api/blog/publish/:id', async () => {
        const response = await request(app).patch(`/api/blog/publish/${_id1}`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("status")
        expect(response.body).toHaveProperty("article")
        expect(response.body).toHaveProperty("message")
        expect(response.body.status).toBe(true)
        expect(response.body.article.state).toBe("published")
        expect(response.body.message).toBe("Update successful - your article is now live")
    })

    it('logged in users(owner) should be able to update draft to publish - PATCH request /api/blog/publish/:id', async () => {
        const response = await request(app).patch(`/api/blog/publish/${_id2}`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("status")
        expect(response.body).toHaveProperty("article")
        expect(response.body).toHaveProperty("message")
        expect(response.body.status).toBe(true)
        expect(response.body.article.state).toBe("published")
        expect(response.body.message).toBe("Update successful - your article is now live")
    })

    it('both logged and non-logged in users should be able to get all published articles - GET request /api/blog', async () => {
        let tags = "newbies"
        const response = await request(app).get(`/api/blog`)
        .set('content-type', 'application/json')
        
        expect(response.status).toBe(200)
        expect(response.body.length).toBe(2)
    })


    it('both logged and non-logged in users should be able to get a published article by id - GET request /api/blog/article/:idOrTitle', async () => {
        const response = await request(app).get(`/api/blog/article/${_id1}`)
        .set('content-type', 'application/json')
        
        expect(response.status).toBe(200)
    })

    it('both logged and non-logged in users should be able to get a published article by title - GET request /api/blog/article/:idOrTitle', async () => {
        const title = "understanding-css-positioning"
        const response = await request(app).get(`/api/blog/article/${title}`)
        .set('content-type', 'application/json')
        
        expect(response.status).toBe(200)
    })

    it('both logged and non-logged in users should be able to search published articles by tags - GET request /api/blog', async () => {
        let tags = "newbies,css"
        const response = await request(app).get(`/api/blog?tags=${tags}`)
        .set('content-type', 'application/json')
        
        expect(response.status).toBe(200)
        expect(response.body.length).toBe(1)
    })

    it('both logged and non-logged in users should be able to order published articles by read_count - GET request /api/blog', async () => {
        let order_by = "read_count"
        const response = await request(app).get(`/api/blog?order_by=${order_by}&order=desc`)
        .set('content-type', 'application/json')
        
        expect(response.status).toBe(200)
        expect(response.body[0].title).toBe("Understanding CSS Positioning")
    })

    it('logged in users(owner) should be able to delete an article by id - DELETE request /api/blog/article/id', async () => {
        const response = await request(app).delete(`/api/blog/article/${_id1}`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(200)
        expect(response.body).toEqual({message: "Article successfully deleted", status: true})

    })
})