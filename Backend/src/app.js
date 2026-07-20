const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const authRouter = require('./Router/auth.routes.js');
const musicRouter = require('./Router/music.routes.js')

const app = express();

app.use(
    cors({
    origin: [
    "http://localhost:5173",
    ],
    credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/music", musicRouter);


//just to test the jest supertest
app.get('/', (req, res) => {
    res.status(200).json({message: "Hello its a jest test only"});
});

module.exports = app;