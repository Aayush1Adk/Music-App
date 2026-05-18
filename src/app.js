const express = require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('./Router/auth.routes.js');
const musicRouter = require('./Router/music.routes.js')

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/music", musicRouter);


module.exports = app;