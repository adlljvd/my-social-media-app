import { ObjectId } from "mongodb";
import { db } from "../config/mongodb.js";

export default class Post {
    static getCollection() {
        return db.collection("Posts");
    }

    static async getPosts() {
        const collection = this.getCollection()

        const posts = await collection.aggregate(
            [
                {
                    $lookup: {
                        from: "Users", //table asalnya
                        localField: "authorId", //fk,
                        foreignField: "_id", //pk
                        as: "author" //alias
                    }
                },
                {
                    $unwind: {
                        path: "$author",
                        preserveNullAndEmptyArrays: false
                    }
                },
                {
                    $project: {
                        "author.password": 0
                    }

                },
                {
                    $sort: {
                        updatedAt: -1
                    }
                },
            ]
        ).toArray();

        return posts
    }

    static async addPost(payload) {
        const { content, tags, imgUrl, authorId } = payload

        const collection = this.getCollection()
        const post = await collection.insertOne({
            content,
            tags,
            imgUrl,
            authorId: new ObjectId(authorId),
            comments: [],
            likes: [],
            createdAt: new Date(),
            updatedAt: new Date()
        })

        return ({
            message: "Post created successfully"
        })
    }

    static async addComment(payload) {
        const { content, username, postId } = payload
        const collection = this.getCollection()


        const post = await collection.findOne({ _id: new ObjectId(postId) })
        if (!post) throw new Error("Post not found")

        console.log(post, "<<ini postnya")

        //add comment
        await collection.updateOne(
            {
                _id: new ObjectId(postId)
            },
            {
                $push: {
                    comments: {
                        content,
                        username,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                }
            }
        )

        return ({
            message: "Comment added successfully"
        })

    }

    static async addLike(payload) {
        const { username, postId } = payload
        const collection = this.getCollection()

        const post = await collection.findOne({
            _id: new ObjectId(postId),
            "likes.username": username
        })

        if (post) throw new Error("You already liked this post")

        await collection.updateOne(
            {
                _id: new ObjectId(postId)
            },
            {
                $push: {
                    likes: {
                        username,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                }
            }
        )

        // return ({
        //     message: "Like added successfully"
        // })
        const updatedPost = await collection.findOne({ _id: new ObjectId(postId) });

        return updatedPost; // Return the updated post
    }

    static async getPostById(id) {
        const collection = this.getCollection()

        // const post = await collection.findOne({
        //     _id: new ObjectId(id)
        // })

        const post = await collection.aggregate([
            {
                $match: { _id: new ObjectId(id) }
            },
            {
                $lookup: {
                    from: "Users",
                    localField: "authorId",
                    foreignField: "_id",
                    as: "author"
                }
            },
            {
                $unwind: {
                    path: "$author",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    "author.password": 0
                }
            }
        ]).toArray();


        return post[0]

    }
}

