const { verifyToken } = require("../helpers/token")
const { User, Product, Category } = require("../models/index")


const authentication = async (req, res, next) => {
    try {
        let token;

        // Check for access_token header
        if (req.headers.access_token) {
            token = req.headers.access_token;
        }
        // Check for Authorization Bearer token
        else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            throw { name: "Unauthorized", message: "jwt must be provided" }
        }

        const payload = verifyToken(token)
        const user = await User.findByPk(payload.id)
        if (!user) throw { name: "Unauthorized", message: "Invalid token" }
        req.user = {
            id: user.id, email: user.email, role: user.role
        }
        next()
    } catch (error) {
        next(error)
    }
}

const authorization = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id)

        if (!product) {
            throw { name: "Not Found", message: "Product not found" }
        }

        if (product.authorId === req.user.id || req.user.role === "admin") {
            next()
        } else {
            throw { name: "Forbidden", message: "Access Forbidden" }
        }
    } catch (err) {
        next(err)
    }
}

const authorizationStatus = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id)

        if (!product) {
            throw { name: "Not Found", message: "Product not found" }
        }

        if (req.user.role === "admin") {
            next()
        } else {
            throw { name: "Forbidden", message: "Access Forbidden" }
        }
    } catch (err) {
        next(err)
    }
}


module.exports = { authorization, authentication, authorizationStatus }  
