import User from '../models/User.js';
import { verifyToken } from '../helpers/jwt.js';

const authentication = async (req) => {
    const token = req.headers.authorization;
    if (!token) throw new Error("Unauthorized");
    // console.log("masuk")

    const access_token = token.split(' ')[1];
    if (!access_token) throw new Error("Unauthorized");
    // console.log("masuk 2")

    const payload = verifyToken(access_token);
    // console.log(payload)
    if (!payload) throw new Error("Unauthorized");
    console.log("Payload:", payload);


    const user = await User.findById(payload.id);
    if (!user) throw new Error("Unauthorized");
    console.log("User found:", user);

    return {
        user
    };
};

export default authentication;
