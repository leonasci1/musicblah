// 1. Carrega variáveis de ambiente
require('dotenv').config();

// 2. Importações
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const { Strategy: SpotifyStrategy } = require('passport-spotify');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const postRoutes = require('./routes/posts');

// 3. Inicializa o Express e configura a porta
const app = express();
const PORT = process.env.PORT || 5000;

// 4. Configuração do CORS para permitir requisições do frontend
app.use(
  cors({
    origin: 'http://localhost:8080',
    credentials: true,
  })
);

// 5. Middlewares para interpretar o corpo das requisições
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/posts', postRoutes);

// 6. Inicializa o Passport
app.use(passport.initialize());

// 7. Conexão com o MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.error('Erro ao conectar no MongoDB:', err));

// 8. Modelo User com Mongoose (removido o campo "username")
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  spotifyId: { type: String, unique: true, sparse: true },
});
const User = mongoose.model('User', UserSchema);

// 9. Configuração da estratégia Passport‑Spotify
passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: process.env.SPOTIFY_CALLBACK_URL,
    },
    async (accessToken, refreshToken, expires_in, profile, done) => {
      try {
        let user = await User.findOne({ spotifyId: profile.id });

        if (!user) {
          const emailFromSpotify =
            Array.isArray(profile.emails) && profile.emails.length > 0
              ? profile.emails[0].value
              : null;

          if (!emailFromSpotify) {
            return done(new Error('Spotify profile sem email'));
          }

          const hashedPassword = await bcrypt.hash(profile.id, 10);

          user = new User({
            email: emailFromSpotify,
            spotifyId: profile.id,
            password: hashedPassword,
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// 10. Rotas de autenticação Spotify
app.get(
  '/auth/spotify',
  passport.authenticate('spotify', {
    scope: ['user-read-email', 'user-read-private'],
  })
);

app.get(
  '/auth/spotify/callback',
  passport.authenticate('spotify', { session: false, failureRedirect: 'http://localhost:8080/login' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`http://localhost:8080/?token=${token}`);
  }
);

// 11. Rotas de signup e login local

// Signup (utilizando apenas email e password)
app.post('/signup', async (req, res) => {
  console.log('👉 /signup body:', req.body);
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e password são obrigatórios' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed });
    await user.save();

    console.log('✅ Usuário criado:', user._id);
    return res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
  } catch (err) {
    console.error('❌ Erro ao cadastrar usuário:', {
      name: err.name,
      code: err.code,
      message: err.message,
    });
    console.error(err.stack);
    return res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
});

// Login (através de email e password)
app.post('/login', async (req, res) => {
  console.log('👉 /login body:', req.body);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e password são obrigatórios' });
    }

    const user = await User.findOne({ email });
    console.log('👤 user found:', user);

    if (!user) {
      return res.status(401).json({ error: 'Usuário ou senha incorretos' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔒 password match:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: 'Usuário ou senha incorretos' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Inclui os dados do usuário na resposta
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username || null, // Inclui username se existir
      },
    });
  } catch (err) {
    console.error('❌ Erro ao fazer login:', err);
    return res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// 12. Middleware de proteção JWT
const authenticateJWT = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(403).json({ error: 'Token não fornecido' });
  }
  const token = auth.replace('Bearer ', '');
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// 13. Rota protegida de exemplo
app.get('/profile', authenticateJWT, (req, res) => {
  res.json({ message: `Bem-vindo, usuário ${req.user.id}` });
});

// Novo trecho adicionado
const dbConnect = require('./config/db');
dbConnect();

app.use('/auth', require('./routes/auth'));
app.use('/posts', require('./routes/posts'));
app.use('/users', require('./routes/users'));
app.use('/search', require('./routes/search'));

// 14. Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});