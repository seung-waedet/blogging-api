const request = require('supertest')
const app = require('../index')


describe('test root route', () => {
    it('test home route - GET request /', async () => {
        const response = await request(app).get('/')
        .set('content-type', 'application/json')

        expect(response.status).toBe(200)
        expect(response.body).toEqual({status: true, message: `Welcome to Annies Blog API`})
    })

    it('Should return error when routed to an unknown route', async () => {
        const response = await request(app).get('/undefined')
        .set('content-type', 'application/json')

        expect(response.status).toBe(404)
        expect(response.body).toEqual({status: false, message: `Route not found`})
    })
})