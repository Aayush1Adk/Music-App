const express = require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('./Router/auth.routes.js');
const musicRouter = require('./Router/music.routes.js')

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/music", musicRouter);


//just to test the jest supertest

app.get('/', (req, res) => {
    res.status(200).json({message: "Hello its a jest test only"});
});

module.exports = app;