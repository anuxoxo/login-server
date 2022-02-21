const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require("validator");

const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "Please enter an email address"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [6, "Minimum password  length should be 6 characters"]
    }
});

// fire a function before a doc is saved to db
userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})


const User = mongoose.model('User', userSchema);
module.exports = User;