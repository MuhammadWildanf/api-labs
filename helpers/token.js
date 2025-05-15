const jwt = require('jsonwebtoken');

const createToken = (payload) => {
    return jwt.sign(payload, process.env.TOKEN_SECRET);
}

const verifyToken = (token) => {
    return jwt.verify(token, process.env.TOKEN_SECRET);
}

module.exports = { createToken, verifyToken }