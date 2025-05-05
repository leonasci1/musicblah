const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Código original
const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao registrar usuário', error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const user = req.user;
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao fazer login', error: err.message });
  }
};

const spotifyCallback = (req, res) => {
  res.redirect('/');
};

// Novas funções adicionadas
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validações básicas
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    // Verifica se o email já está registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já está em uso' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao registrar usuário', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validações básicas
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    // Busca o usuário pelo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Compara a senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gera o token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao fazer login', error: err.message });
  }
};

// Exportação
module.exports = { register, login, spotifyCallback, signup: exports.signup, loginAlt: exports.login };