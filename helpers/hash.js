const bcrypt = require("bcryptjs");

const hash = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

const compareHash = (password, hashPassword) => {
    return bcrypt.compare(password, hashPassword);
};

module.exports = { hash, compareHash };
