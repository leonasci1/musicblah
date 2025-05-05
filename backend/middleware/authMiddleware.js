const jwt = require('jsonwebtoken');

// Middleware atualizado
module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido no cabeçalho x-auth-token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

// Novo middleware adicionado
module.exports.bearerAuth = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Bearer ')) {
    console.log('Token ausente ou formato inválido:', auth);
    return res.status(403).json({ error: 'Token não fornecido ou formato inválido' });
  }

  try {
    const token = auth.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Usuário autenticado:', req.user);
    next();
  } catch (err) {
    console.error('Erro ao verificar token:', err.message);
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

// Middleware combinado
module.exports.authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token') || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};