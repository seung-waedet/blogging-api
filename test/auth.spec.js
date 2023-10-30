const request = require('supertest')
const app = require('../index')
const { connect } = require('./database')
const userModel = require('../models/userModel')
const users = require('../fixtures/users.json')

describe('authenticate a user', () => {
    let conn;

    beforeAll(async () => {
        conn = await connect()
    })

    afterEach(async () => {
        await conn.cleanup()
    })

    afterAll(async () => {
        await conn.disconnect()
    })

    it('should signup a user - POST request /api/signup', async () => {
        const response = await request(app).post('/api/signup')
        .set('content-type', 'application/json')
        .send(users[0])
        
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('message')
        expect(response.body).toHaveProperty('status')
        expect(response.body).toHaveProperty('user')
        expect(response.body.status).toBe(true)
        expect(response.body.message).toBe('Signup successful')
        expect(response.body.user.first_name).toBe(users[0].first_name)
        expect(response.body.user.last_name).toBe(users[0].last_name)
        expect(response.body.user.email).toBe(users[0].email)
    })

    it('should test if a user provides incorrect details during signup - POST request /api/signup', async () => {
        const response = await request(app).post('/api/signup')
        .set('content-type', 'application/json')
        .send(users[2])
        
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe("User validation failed: last_name: last_name field is required")
    })

    it('should login a user - POST request /api/login', async () => {
        //Add a user to db
        const user = await userModel.create(users[1])

        const response = await request(app).post('/api/login')
        .set('content-type', 'application/json')
        .send({email: users[1].email, password: users[1].password})

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('message')
        expect(response.body).toHaveProperty('token')
        expect(response.body.message).toBe('Login successful')
        
    })

    it('should test if the user doesnt provide the necessary info during login - POST request /api/login', async () => {
        //Add a user to db
        const user = await userModel.create(users[1])

        const response = await request(app).post('/api/login')
        .set('content-type', 'application/json')
        .send({email: users[1].email})

        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Missing credentials')
        expect(response.body).not.toHaveProperty('token')
        
    })
})