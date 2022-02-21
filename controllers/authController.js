require('dotenv').config()
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { createTokens } = require("../jwt");

const handleError = (err) => {
    // console.log(err);
    // console.log(err.message, err.code);
    let errors = { email: '', password: '' };

    // duplicate email error
    if (err.code === 11000) {
        errors.email = 'User is already registered';
        return errors;
    }

    // validation errors
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
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

module.exports.login_post = (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email }, function (err, user) {
        if (err) {
            return res.json({
                success: false,
                message: err.message,
            });
        }

        if (!user) res.status(400).json({
            success: false,
            error: "User Doesn't Exist"
        });

        bcrypt.compare(password, user.password).then((match) => {
            if (!match) {
                res
                    .status(400)
                    .json({
                        success: false,
                        error: "Wrong Username and Password Combination!"
                    });
            } else {
                const accessToken = createTokens(user);

                res.cookie("access-token", accessToken, {
                    maxAge: 60 * 60 * 24 * 30 * 1000,
                    httpOnly: true,
                });

                res.json({ auth: true, success: true, message: "Successfully Logged in" });
            }
        });
    })
}

