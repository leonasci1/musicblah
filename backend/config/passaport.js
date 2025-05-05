const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Estratégia para autenticação via Spotify
passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: process.env.SPOTIFY_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ spotifyId: profile.id });
        if (!user) {
          // Cria um usuário novo com o spotifyId e um username padrão.
          // A senha é gerada a partir do próprio profile.id, hashada com bcrypt.
          user = new User({
            spotifyId: profile.id,
            username: profile.displayName || profile.id,
            password: await bcrypt.hash(profile.id, 10),
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

// Estratégia para autenticação local (usuário e senha)
passport.use(
  new LocalStrategy(
    {
      usernameField: 'username', // Campo esperado para o nome de usuário (caso utilize outro nome, ajuste)
      passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          return done(null, false, { message: 'Usuário não encontrado' });
        }
        // Comparação de senha utilizando bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Senha incorreta' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serializa o usuário para armazenar na sessão
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Desserializa o usuário a partir do ID armazenado na sessão
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
