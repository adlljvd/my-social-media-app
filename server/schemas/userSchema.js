import { ObjectId } from "mongodb";
import User from "../models/User.js";

const typeDefs = `#graphql

type Follower{
    _id: ID
    name: String
    username: String
}

type Following{
    _id: ID
    name: String
    username: String
}

type User{
    _id: ID
    name: String
    username: String
    email: String
    followerDetails: [Follower]
    followingDetails: [Following]
}

type GeneralResponse {
    message: String
}

type LoginResponse {
    access_token: String
}

input RegisterInput {
    name: String
    username: String!
    email: String!
    password: String!
}

input LoginInput {
    username: String
    password: String
}

input FindUserInput {
    username: String
    name: String
}

type Query {
    searchUsers(keyword: String): [User]
    myProfile(id: String): User
    userProfile(id:String): User
}

type Mutation {
    register(newUser: RegisterInput): GeneralResponse
    login(user: LoginInput): LoginResponse
}

`

const resolvers = {
    Query: {
        searchUsers: async (_, args, context) => {
            const response = await User.searchUsers(args.keyword)

            return response
        },
        myProfile: async (_, __, context) => {
            const { user } = await context.authN()
            const userId = user._id;

            const response = await User.findById(userId);
            return response

        },
        userProfile: async (_, args, context) => {
            await context.authN()

            const { id } = args
            const response = await User.findById(id)

            return response
        }

    },

    Mutation: {
        login: async (_, args) => {
            console.log("masuk login")
            const { username, password } = args.user

            const response = User.login({ username, password })

            return response
        },
        register: async (_, args) => {
            const { name, username, email, password } = args.newUser;

            const response = await User.register({ name, username, email, password })

            return response
        }
    }
}


export { typeDefs, resolvers };
