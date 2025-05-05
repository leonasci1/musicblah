// src/routes/auth.js

const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Verifique se o modelo inclui 'username', 'email' e 'password'

// Rota de cadastro (signup)
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  // Validação básica
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email e password são obrigatórios' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já está em uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    return res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error('Erro ao criar usuário:', err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// Rota de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // Validação básica
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e password são obrigatórios' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Gera o token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Retorna o token e os dados do usuário
    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username || user._id, // Fallback para ID caso username não exista
        email: user.email,
      }
    });
  } catch (err) {
    console.error('Erro ao fazer login:', err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

module.exports = router;
