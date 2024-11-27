import Post from "../models/Post.js";
import redis from "../config/redis.js";


const typeDefs = `#graphql
    type Comments{
        content: String
        username: String
        createdAt: String
        updatedAt: String
    }

    type Likes{
        username: String
        createdAt: String
        updatedAt: String
    }

    type Author{
        _id: ID
        username: String
        name: String
        email: String
    }

    type Post{
        _id: ID
        content: String
        tags: [String]
        imgUrl: String
        authorId: ID
        author: Author
        comments: [Comments]
        likes: [Likes]
        createdAt: String
        updatedAt: String
    }

    type GeneralResponse {
        message: String
    }

    input PostInput{
        content: String!
        tags: [String]
        imgUrl: String
    }

    input CommentInput{
        postId: ID
        content: String
    }

    input LikeInput{
        postId: ID
    }

    type Query{
        posts: [Post] #ini dari type post, kalau bnayak oake []
        postById(id: String): Post
    }

    type Mutation{
        addPost(newPost: PostInput): GeneralResponse
        addComment(newComment: CommentInput): GeneralResponse
        addLike(newLike: LikeInput): GeneralResponse
    }

`

const resolvers = {
    Query: {
        posts: async (_, args, context) => {
            await context.authN()
            const cachedPosts = await redis.get("posts");
            if (cachedPosts) return JSON.parse(cachedPosts);


            const response = await Post.getPosts()
            await redis.set("posts", JSON.stringify(response));

            return response
        },

        postById: async (_, args, context) => {
            await context.authN()

            const { id } = args
            const response = await Post.getPostById(id)

            return response
        }
    },

    Mutation: {
        addPost: async (_, args, context) => {
            const { user } = await context.authN()
            const { content, tags, imgUrl } = args.newPost
            const authorId = user._id

            const response = await Post.addPost({ content, tags, imgUrl, authorId })
            await redis.del("posts");


            return response

        },

        addComment: async (_, args, context) => {
            const { user } = await context.authN()

            if (!user) throw new Error("Unauthorized");

            const { postId, content } = args.newComment
            const username = user.username

            const response = await Post.addComment({ postId, content, username })
            console.log(response, "<<<response")
            await redis.del("posts");

            return response
        },

        addLike: async (_, args, context) => {
            const { user } = await context.authN()

            const { postId } = args.newLike
            const username = user.username

            const response = await Post.addLike({ postId, username })
            console.log(response, "<<<response")
            await redis.del("posts");

            return response
        }
    }
}

export { typeDefs, resolvers };
