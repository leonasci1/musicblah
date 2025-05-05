const router = require('express').Router();
const { getProfile } = require('../controllers/userController');
const authenticateJWT = require('../middleware/authenticateJWT');
const mongoose = require('mongoose');

// Middleware para validar o ID do usuário
const validateUserId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'ID de usuário inválido' });
  }
  next();
};

// Rota para buscar o perfil do usuário
router.get('/:id', authenticateJWT, validateUserId, getProfile);

module.exports = router;