import jwt from 'jsonwebtoken';
import 'dotenv/config'

const privateKey = process.env.SECRET_KEY

function signToken(payload) {
    return jwt.sign(payload, privateKey);
}

function verifyToken(token) {
    return jwt.verify(token, privateKey);
}

export { signToken, verifyToken }