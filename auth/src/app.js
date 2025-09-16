require('dotenv').config();
const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRouter = require('./routes/auth.routes');
app.use('/api/auth', authRouter);

module.exports = app;