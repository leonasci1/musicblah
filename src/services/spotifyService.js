const fetch = require('node-fetch');

exports.search = async (q, type) => {
  // monta URL https://api.spotify.com/v1/search?q=${q}&type=${type}
  // inclui Bearer token, retorna json
};

exports.validateUrl = async (url) => {
  // extrai ID, chama /tracks/{id} ou /artists/{id}, retorna true/false + metadata
};

exports.getCurrentlyPlaying = async (accessToken) => {
  // chama /me/player/currently-playing
};