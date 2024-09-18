const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../index');
require('dotenv').config();

let server;

beforeAll(async () => {
    // Set up the database connection
    await mongoose.connect(process.env.MONGO_URI);

    const port = process.env.PORT_TEST || 3002;
    // Start the server
    server = app.listen(port, () => {
        console.log('Server is running on port ' + port);
    });
});

afterAll(async () => {
    // Close the server
    await new Promise(resolve => server.close(resolve));

    // Close the database connection
    await mongoose.connection.close();
});

describe('POST /api/player', () => {
    it('should create a player with valid data', async () => {
        const newPlayer = {
            name: 'John Doe',
            position: 'forward',
            playerSkills: [
                { skill: 'speed', value: 85 },
                { skill: 'attack', value: 90 }
            ]
        };

        const response = await request(app)
            .post('/api/player')
            .send(newPlayer)
            .expect('Content-Type', /json/)
            .expect(201);

        expect(response.body).toHaveProperty('name', 'John Doe');
        expect(response.body).toHaveProperty('position', 'forward');
        expect(response.body.playerSkills).toHaveLength(2);
    });

    it('should return 400 if name is missing', async () => {
        const invalidPlayer = {
            position: 'forward',
            playerSkills: [{ skill: 'speed', value: 85 }]
        };

        const response = await request(app)
            .post('/api/player')
            .send(invalidPlayer)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toHaveProperty('message', 'Name is required');
    });

    it('should return 400 if position is invalid', async () => {
        const invalidPlayer = {
            name: 'John Doe',
            position: 'striker',
            playerSkills: [{ skill: 'speed', value: 85 }]
        };

        const response = await request(app)
            .post('/api/player')
            .send(invalidPlayer)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toHaveProperty('message', 'Invalid value for position: striker.');
    });

    it('should return 400 if playerSkills is not an array', async () => {
        const invalidPlayer = {
            name: 'John Doe',
            position: 'forward',
            playerSkills: 'speed, attack'
        };

        const response = await request(app)
            .post('/api/player')
            .send(invalidPlayer)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toHaveProperty('message', 'Player skills must be an array');
    });

    it('should return 400 if playerSkills is empty', async () => {
        const invalidPlayer = {
            name: 'John Doe',
            position: 'forward',
            playerSkills: []
        };

        const response = await request(app)
            .post('/api/player')
            .send(invalidPlayer)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toHaveProperty('message', 'At least one skill is required');
    });

    it('should return 400 if skill is invalid', async () => {
        const invalidPlayer = {
            name: 'John Doe',
            position: 'forward',
            playerSkills: [{ skill: 'unknown', value: 85 }]
        };

        const response = await request(app)
            .post('/api/player')
            .send(invalidPlayer)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toHaveProperty('message', 'Invalid value for skill: unknown.');
    });

    it('should return 400 if skill value is out of range', async () => {
        const invalidPlayer = {
            name: 'John Doe',
            position: 'forward',
            playerSkills: [{ skill: 'speed', value: 105 }]
        };

        const response = await request(app)
            .post('/api/player')
            .send(invalidPlayer)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toHaveProperty('message', 'Invalid value for skill value: 105. It should be an integer between 0 and 100.');
    });

    it('should return 400 if there are duplicate skills', async () => {
        const invalidPlayer = {
            name: 'John Doe',
            position: 'forward',
            playerSkills: [
                { skill: 'speed', value: 85 },
                { skill: 'speed', value: 90 }
            ]
        };

        const response = await request(app)
            .post('/api/player')
            .send(invalidPlayer)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toHaveProperty('message', 'Duplicate skills are not allowed');
    });
});
