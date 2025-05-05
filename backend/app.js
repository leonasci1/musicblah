const express = require('express');
const passport = require('./config/passport');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use('/auth', authRoutes);

module.exports = app;