import {GraphQLServer} from "graphql-yoga";
import {prisma} from "./generated";
import resolvers from "./resolvers"
import * as dotenv from "dotenv"
dotenv.config();

const server = new GraphQLServer({
    typeDefs: __dirname + '/schema.graphql',
    resolvers,
    context: request => ({
        ...request,
        prisma,
    })
});

const options = {
    port: process.env.PORT || 5500,
    endpoint: '/graphql',
    subscriptions: '/subscriptions',
    playground: '/playground',
    cors: {
        credentials: true,
        origin: [process.env.CLIENT_URL] // your frontend url.
    }
};


server.start(options, ({port}) => {
    console.log(`Server is running on port ${port}`);
    console.log(`🚀 Playground ready at http://localhost:${port}/playground`)
});