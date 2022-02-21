const { sign, verify } = require("jsonwebtoken");
require('dotenv').config()

const createTokens = (user) => {
    const accessToken = sign(
        { id: user.id },
        process.env.JWT_SECRET_KEY
    );

    return accessToken;
};

const validateToken = (req, res, next) => {
    const accessToken = req.cookies["access-token"];

    if (!accessToken)
        return res.status(400).json({ auth: false, success: false, error: "User not Authenticated!" });

    try {
        const validToken = verify(accessToken, process.env.JWT_SECRET_KEY);
        if (validToken) {
            req.authenticated = true;
            return next();
        }
    } catch (err) {
        return res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = { createTokens, validateToken };