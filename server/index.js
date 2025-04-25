const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();


const app = express();
const router = require('./router/index.js');
const errorMiddleware = require('./middlewares/error-middleware');
const  jwt = require("jsonwebtoken");

app.use(cors({
    credentials: true,
    origin: "http://localhost:5173",
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api', router)

const PORT = process.env.PORT || 5000;

app.use(errorMiddleware);


const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL,);
        app.listen(PORT, () => {
            console.log(`Starting on ${PORT}`);
        });
    } catch (e) {
        console.error("MongoDB connection error", e);

    }
}

start();