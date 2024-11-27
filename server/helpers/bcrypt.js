import bcrypt from "bcryptjs";


function hash(plainPass) {
    let salt = bcrypt.genSaltSync(10);
    let hashedPass = bcrypt.hashSync(plainPass, salt)
    return hashedPass
}

function compare(plainPass, hashedPass) {
    return bcrypt.compareSync(plainPass, hashedPass);
}

export { hash, compare }