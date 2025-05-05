const express = require('express');
const passport = require('passport');
const { register, login, spotifyCallback } = require('../controllers/authController');
const { signup} = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', passport.authenticate('local', { session: false }), login);
router.get('/spotify', passport.authenticate('spotify', { scope: ['user-read-email', 'user-read-private'] }));
router.get('/spotify/callback', passport.authenticate('spotify', { failureRedirect: '/login' }), spotifyCallback);
router.post('/signup', signup);
router.post('/login', login);

module.exports = router;