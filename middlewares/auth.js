const { verifyToken } = require("../helpers/token")
const { User, Product, Category } = require("../models/index")


const authentication = async (req, res, next) => {
    try {
        const { access_token } = req.headers
        const payload = verifyToken(access_token)
        const user = await User.findByPk(payload.id)
        if (!user) throw { name: "Unauthorized", msg: "Invalid token" }
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
