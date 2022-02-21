require('dotenv').config()
const User = require('../models/User');
const { createTokens } = require("../jwt");

const handleError = (err) => {
    console.log(err.message, err.code);
    let errors = { success: false, email: '', password: '' };

    // incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'That email is not registered';
    }

    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'That password is incorrect';
    }

    // duplicate email error
    if (err.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }

    // validation errors
    if (err.message.includes('user validation failed')) {
        // console.log(err);
        Object.values(err.errors).forEach(({ properties }) => {
            // console.log(val);
            // console.log(properties);
            errors[properties.path] = properties.message;
        });
    }

    return errors;
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

        res.json({ auth: true, success: true, message: "Successfully Logged in",email });
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