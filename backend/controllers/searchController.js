const spotifyService = require('../services/spotifyService');
const User = require('../models/User');

exports.searchSpotify = async (req, res) => {
  const { q, type } = req.query;
  const data = await spotifyService.search(q, type);
  res.json(data);
};

exports.searchUsers = async (req, res) => {
  const { q } = req.query;
  const users = await User.find({ username: new RegExp(q, 'i') });
  res.json(users);
};