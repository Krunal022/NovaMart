const request = require('supertest');
const app = require('../src/app');

describe('POST /auth/register', () => {
	it('creates a user and returns 201', async () => {
		const res = await request(app)
			.post('/auth/register')
			.send({
				username: 'krunal',
				email: 'krunal@example.com',
				password: 'Secret#123',
				fullName: { firstName: 'Krunal', lastName: 'Patel' },
				role: 'user',
				address: [{ city: 'Ahmedabad', country: 'IN' }]
			});

		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty('message', 'Registered successfully');
		expect(res.body.user).toMatchObject({
			username: 'krunal',
			email: 'krunal@example.com',
			fullName: { firstName: 'Krunal', lastName: 'Patel' },
			role: 'user',
		});
		expect(res.body.user).toHaveProperty('id');
	});

	it('rejects duplicates with 409', async () => {
		await request(app)
			.post('/auth/register')
			.send({
				username: 'dup',
				email: 'dup@example.com',
				password: 'Secret#123',
				fullName: { firstName: 'Du', lastName: 'P' }
			});

		const res = await request(app)
			.post('/auth/register')
			.send({
				username: 'dup',
				email: 'dup@example.com',
				password: 'Secret#123',
				fullName: { firstName: 'Du', lastName: 'P' }
			});

		expect(res.status).toBe(409);
		expect(res.body).toHaveProperty('message', 'User already exists');
	});

	it('validates required fields with 400', async () => {
		const res = await request(app)
			.post('/auth/register')
			.send({ email: 'nope@example.com' });
		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty('message', 'Missing required fields');
	});
});


