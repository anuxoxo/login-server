require('dotenv').config()
const User = require('../models/User');
const { createTokens } = require("../jwt");

const handleError = (err) => {
    console.log(err.message, err.code);
    let errorMessage = "";

    // incorrect email/password
    if (err.message === 'incorrect email' || err.message === 'incorrect password') {
        errorMessage = 'Invalid Email or Password';
    }

    // duplicate email error
    if (err.code === 11000) {
        errorMessage = 'User already exists';
        return errorMessage;
    }

    // validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errorMessage = properties.message;
        });
    }

    return errorMessage;
}

module.exports.register_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const newUser = await User.create({ email, password });
        res.status(201).json({
            success: true,
            user: newUser._id,
            message: "Successfully Registered"
        });
    } catch (err) {
        let errors = handleError(err);
        res.status(400).json({ errors });
    }
}

module.exports.login_get = (req, res) => {
    res.json({ auth: true });
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const accessToken = createTokens(user);
        res.cookie("access-token", accessToken, {
            maxAge: 60 * 60 * 24 * 30 * 1000,
            httpOnly: true,
        });

        res.json({ auth: true, success: true, message: "Successfully Logged in" });
    }
    catch (err) {
        let errors = handleError(err);
        res.status(400).json({ errors });
    }
}

module.exports.logout = (req, res) => {
    res.clearCookie('access-token');
    res.json({ success: true, message: "Successfully Logged out" });
}