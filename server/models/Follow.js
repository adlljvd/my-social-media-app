import { ObjectId } from "mongodb";
import { db } from "../config/mongodb.js";
import User from "../models/User.js"

export default class Follow {
    static getCollection() {
        return db.collection("Follows");
    }

    static async followUser(payload) {
        const collection = this.getCollection()

        const { followingId, followerId } = payload

        console.log(followingId, "<<<following Id")
        console.log(followerId, "<<<follower Id")

        const user = await User.findById(followingId)
        if (!followingId) throw new Error("User not found")


        const existingFollow = await collection.findOne({
            followerId: new ObjectId(followerId),
            followingId: new ObjectId(followingId)
        })


        if (existingFollow) throw new Error("You are already following this user")

        await collection.insertOne({
            followerId: new ObjectId(followerId),
            followingId: new ObjectId(followingId),
            createdAt: new Date(),
            updatedAt: new Date()
        })

        return {
            message: "Successfully followed the user"
        };
    }


}

