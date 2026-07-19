const request = require('supertest');
const app = require('../app');

//jest is used to test API 

describe('GET /', () => {
    it('should return a welcome message', async () => {
        const res = await request(app).get('/');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({message: "Hello its a jest test only"});
    });
}); 

