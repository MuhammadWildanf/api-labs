module.exports = (err, req, res, next) => {
    console.log(err);

    switch (err.name) {
        case "Updated Failed":
            return res.status(400).json({ name: "Updated Failed", message: err.message })
        case "Invalid Status":
            return res.status(400).json({ name: "Invalid Status", message: err.message })
        case "JsonWebTokenError":
            return res.status(401).json({ name: "Unauthorized", message: err.message })
        case "Forbidden":
            return res.status(403).json({ name: "Forbidden", message: err.message })
        case "Unauthorized":
            return res.status(401).json({ name: "Unauthorized", message: err.message })
        case "Not Found":
            return res.status(404).json({ name: "Not Found", message: err.message })
        case "SequelizeValidationError":
            return res.status(400).json({ name: "Validation Error", message: err.errors[0].message })
        case "SequelizeUniqueConstraintError":
            return res.status(400).json({ name: "Validation Error", message: err.errors[0].message })
        default:
            return res.status(500).json({ name: "Internal Server Error", message: err.message })
    }


}