const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  const { spotifyUrl, text } = req.body;
  // ... validar URL com spotifyService, criar post
};

exports.getFeed = async (req, res) => {
  // ... retorna posts ordenados por createdAt desc
};

exports.likePost = async (req, res) => {
  // ... toggle like
};

exports.commentPost = async (req, res) => {
  // ... adicionar comentário
};