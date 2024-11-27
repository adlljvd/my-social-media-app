import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import authentication from "./middlewares/authentication.js";
import 'dotenv/config'

import {
    typeDefs as userTypeDefs,
    resolvers as userResolvers,
} from "./schemas/userSchema.js";
import {
    typeDefs as postTypeDefs,
    resolvers as postResolvers
} from "./schemas/postSchema.js"
import {
    typeDefs as followTypeDefs,
    resolvers as followResolvers
} from "./schemas/followSchema.js"



const server = new ApolloServer({
    typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
    resolvers: [userResolvers, postResolvers, followResolvers],
    introspection: true, //supaya playground bisa dibuka dari luar
    playground: true
});

startStandaloneServer(server, {
    context: async ({ req, res }) => {
        return {
            authN: async () => authentication(req),
        };
    },
    listen: {
        port: process.env.PORT,
    },
})
    .then(({ url }) => console.log("🚀  Server ready at:", url))
    .catch(console.log);
