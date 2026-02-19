const jwt = require('jsonwebtoken');

const generateToken = (id, role, name) => {
    return jwt.sign({ id, role, name }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

module.exports = generateToken;
