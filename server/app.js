const { GraphQLServer } = require('graphql-yoga');
const mongoose = require('mongoose');
require('dotenv').config();
const resolvers = require('./src/resolvers');

const { authMiddleware } = require('./src/middleware')

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', () => {
	console.log("Connection succeeded")
});

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	resolvers,
	context: req => ({ ...req }),
	middlewares: [authMiddleware]
})

const options = {
	port: process.env.PORT || 5500,
	endpoint: '/graphql',
	subscriptions: '/subscriptions',
	playground: '/playground',
};

server.start(options, ({ port }) => {
	console.log(`Server is running on port ${port}`);
	console.log(`🚀 Playground ready at http://localhost:${port}/playground`)
});