import {GraphQLServer} from "graphql-yoga";
import {prisma} from "./generated";
import resolvers from "./resolvers"
import * as dotenv from "dotenv"
import {permissions} from './permissions'

dotenv.config();

export const startServer = async () => {

    const server = new GraphQLServer({
        typeDefs: __dirname + '/schema.graphql',
        resolvers,
        middlewares: [permissions],
        context: request => ({
            ...request,
            prisma,
        })
    });

    const options = {
        port: process.env.PORT || 5500,
        endpoint: '/graphql',
        subscriptions: '/subscriptions',
        playground: '/playground'
    };

    await server.start(options, ({port}) => {
        console.log(`Server is running on port ${port}`);
        console.log(`🚀 Playground ready at http://localhost:${port}/playground`)
    });
}

startServer()
    .then(() => {
        console.log('Server is ready')
    })
    .catch(error => {
        console.log(error)
    })