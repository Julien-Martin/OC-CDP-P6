"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_yoga_1 = require("graphql-yoga");
const generated_1 = require("./generated");
const resolvers_1 = require("./resolvers");
const dotenv = require("dotenv");
const permissions_1 = require("./permissions");
dotenv.config();
exports.startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const server = new graphql_yoga_1.GraphQLServer({
        typeDefs: __dirname + '/schema.graphql',
        resolvers: resolvers_1.default,
        middlewares: [permissions_1.permissions],
        context: request => (Object.assign(Object.assign({}, request), { prisma: generated_1.prisma }))
    });
    const options = {
        port: process.env.PORT || 5500,
        endpoint: '/graphql',
        subscriptions: '/subscriptions',
        playground: '/playground'
    };
    yield server.start(options, ({ port }) => {
        console.log(`Server is running on port ${port}`);
        console.log(`🚀 Playground ready at http://localhost:${port}/playground`);
    });
});
exports.startServer()
    .then(() => {
    console.log('Server is ready');
})
    .catch(error => {
    console.log(error);
});
