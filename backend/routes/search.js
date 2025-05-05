const router = require('express').Router();
const { searchSpotify, searchUsers } = require('../controllers/searchController');
const authenticateJWT = require('../middleware/authenticateJWT');

router.get('/spotify', authenticateJWT, searchSpotify);
router.get('/users', authenticateJWT, searchUsers);

module.exports = router;