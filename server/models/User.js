import { ObjectId } from "mongodb";
import { db } from "../config/mongodb.js";
import { hash, compare } from "../helpers/bcrypt.js"
import { signToken, verifyToken } from "../helpers/jwt.js"
import validator from "email-validator";



export default class User {
    static getCollection() {
        return db.collection("Users");
    }

    static async register(payload) {
        const { name, username, email, password } = payload

        const collection = this.getCollection()

        if (!email) throw new Error("Email is required")
        if (!password) throw new Error("Password is required")
        if (!username) throw new Error("Username is required")
        if (password.length < 5) throw new Error("Password minimum 5 characters")
        if (!validator.validate(email)) throw new Error("Invalid email format")

        const findEmail = await collection.findOne({ email })
        if (findEmail) throw new Error("Email already exists")

        const findUsername = await collection.findOne({ username })
        if (findUsername) throw new Error("Username already exists")


        //save
        await collection.insertOne({
            name,
            username,
            email,
            password: hash(password),
        })

        return ({
            message: "Successfully added new user"
        })
    }

    static async login(payload) {
        const { username, password } = payload

        const collection = this.getCollection()

        const user = await collection.findOne({ username })
        if (!user) throw new Error("Invalid username/password")

        if (!compare(password, user.password)) throw new Error("Invalid username/password")

        const access_token = signToken({ id: user._id })

        return {
            access_token
        }
    }

    static async searchUsers(keyword) {

        const collection = this.getCollection()

        const users = await collection.aggregate([
            {
                $match: {
                    $or: [
                        { name: { $regex: keyword, $options: "i" } },
                        { username: { $regex: keyword, $options: "i" } }
                    ]
                }
            },
            {
                $lookup: {
                    from: "Follows",
                    localField: "_id",
                    foreignField: "followingId", //mencari siapa yang following user ini
                    as: "followers"
                }
            },
            {
                $lookup: {
                    from: "Users",
                    localField: "followers.followerId", //menggabungkan/join ke table users untuk mencari details followernya
                    foreignField: "_id",
                    as: "followerDetails"
                }
            },
            {
                $lookup: {
                    from: "Follows",
                    localField: "_id",
                    foreignField: "followerId", //mencari siapa yang di follow sama user ini
                    as: "following"
                }
            },
            {
                $lookup: {
                    from: "Users",
                    localField: "following.followingId", //join ke table users untuk mendapatkan user details followingnya
                    foreignField: "_id",
                    as: "followingDetails"
                }
            },
            {
                $project: {
                    password: 0,
                    followers: 0,
                    following: 0,
                    "followingDetails.password": 0,
                    "followerDetails.password": 0
                }
            }
        ]).toArray()

        if (users.length === 0) throw new Error("User not found")

        console.log(users, "<< user match")
        return users

    }

    static async findById(id) {
        const collection = this.getCollection()

        const user = await collection.aggregate([
            {
                $match: {
                    _id: new ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: "Follows",
                    localField: "_id",
                    foreignField: "followingId", //mencari siapa yang following user ini
                    as: "followers"
                }
            },
            {
                $lookup: {
                    from: "Users",
                    localField: "followers.followerId", //menggabungkan/join ke table users untuk mencari details followernya
                    foreignField: "_id",
                    as: "followerDetails"
                }
            },
            {
                $lookup: {
                    from: "Follows",
                    localField: "_id",
                    foreignField: "followerId", //mencari siapa yang di follow sama user ini
                    as: "following"
                }
            },
            {
                $lookup: {
                    from: "Users",
                    localField: "following.followingId", //join ke table users untuk mendapatkan user details followingnya
                    foreignField: "_id",
                    as: "followingDetails"
                }
            },
            {
                $project: {
                    password: 0,
                    followers: 0,
                    following: 0,
                    "followingDetails.password": 0,
                    "followerDetails.password": 0
                }
            }
        ]).toArray();

        if (user.length < 1) throw new Error("User not found")

        return user[0]
    }
}

