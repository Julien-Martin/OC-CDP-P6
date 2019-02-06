const {GraphQLServer} = require('graphql-yoga');
require('dotenv').config();
const {resolvers} = require('./src/resolvers');
const { prisma } = require('./src/generated');

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	resolvers,
	context: request => {
		return {
			...request,
			prisma,
		}
	}
});

const options = {
	port: process.env.PORT || 5500,
	endpoint: '/graphql',
	subscriptions: '/subscriptions',
	playground: '/playground',
};


server.start(options, ({port}) => {
	console.log(`Server is running on port ${port}`);
	console.log(`🚀 Playground ready at http://localhost:${port}/playground`)
});