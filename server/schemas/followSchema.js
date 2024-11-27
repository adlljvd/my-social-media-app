import Follow from "../models/Follow.js";

const typeDefs = `#graphql
    type Follow{
        _id: ID
        followingId: ID
        followerId: ID
        createdAt: String
        updatedAt: String
    }

    type GeneralResponse {
    message: String
}

    type Mutation{
        followUser(followingId: ID!): GeneralResponse
    }


`

const resolvers = {
    Mutation: {
        followUser: async (_, args, context) => {
            const { user } = await context.authN()
            const { followingId } = args
            const followerId = user._id

            console.log("masuk")
            console.log(followingId, "<<<following Id")
            console.log(followerId, "<<<follower Id")

            if (followerId.toString() === followingId) throw new Error("You cannot follow yourself");


            const response = await Follow.followUser({ followerId, followingId })

            return response
        }
    }
}

export { typeDefs, resolvers };
