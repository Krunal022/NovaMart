const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
	mongoServer = await MongoMemoryServer.create({
		binary: { version: '6.0.6' }
	});
	const uri = mongoServer.getUri();
	process.env.MONGODB_URI = uri;
	await mongoose.connect(uri);
});

afterEach(async () => {
	const collections = await mongoose.connection.db.collections();
	for (const collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	await mongoose.connection.dropDatabase();
	await mongoose.connection.close();
	if (mongoServer) {
		await mongoServer.stop();
	}
});


