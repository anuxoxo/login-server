require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 8000;

// middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.DB_URI)
    .then(() => { app.listen(PORT, console.log("Server connected to localhost ", PORT)) })
    .catch(err => console.log(err.message))

app.get('/', (req, res) => {
    res.send({ msg: "Hello Anushka" })
})

app.use(authRoutes);
