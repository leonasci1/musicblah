const express = require('express');
const Post = require('../models/Post');
const authenticateJWT = require('../middleware/authenticateJWT');

const router = express.Router();

// GET /posts — lista todos os posts
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username email') // Inclui informações do autor
      .populate('comments.author', 'username'); // Inclui informações dos autores dos comentários
    res.json(posts);
  } catch (err) {
    console.error('Erro ao buscar posts:', err);
    res.status(500).json({ error: 'Erro ao buscar posts' });
  }
});

// Validação de dados do post
async function validatePostData(req, res) {
  const { text, spotifyUrl } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'O campo "text" é obrigatório e não pode estar vazio.' });
  }

  if (spotifyUrl && !isValidUrl(spotifyUrl)) {
    return res.status(400).json({ error: 'O campo "spotifyUrl" deve ser uma URL válida.' });
  }

  return { text: text.trim(), spotifyUrl: spotifyUrl || undefined };
}

// POST /posts — cria um novo post
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { text, spotifyUrl } = await validatePostData(req, res);

    const post = new Post({
      author: req.user.id,
      text,
      spotifyUrl,
    });

    await post.save();
    const populated = await post.populate('author', 'username email');
    res.status(201).json(populated);
  } catch (err) {
    console.error('Erro ao criar post:', err.message);
    res.status(500).json({ error: 'Erro ao criar post' });
  }
});

// DELETE /posts/:id — só autor pode apagar
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    console.log('ID do post recebido:', req.params.id);
    console.log('ID do usuário autenticado:', req.user.id);

    const post = await Post.findById(req.params.id);
    if (!post) {
      console.log('Post não encontrado');
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    if (post.author.toString() !== req.user.id) {
      console.log('Usuário não tem permissão para excluir este post');
      return res.status(403).json({ error: 'Sem permissão para excluir este post' });
    }

    await post.deleteOne();
    console.log('Post excluído com sucesso');
    res.json({ message: 'Post excluído com sucesso' });
  } catch (err) {
    console.error('Erro ao excluir post:', err);
    res.status(500).json({ error: 'Erro ao excluir post' });
  }
});

module.exports = router;
