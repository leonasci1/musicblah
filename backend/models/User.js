const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Definição do esquema do usuário
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'O nome de usuário é obrigatório'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'O email é obrigatório'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Validação de email
        },
        message: 'O email fornecido é inválido',
      },
    },
    password: {
      type: String,
      required: [true, 'A senha é obrigatória'],
      minlength: [6, 'A senha deve ter pelo menos 6 caracteres'],
    },
    spotifyId: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

// Middleware para criptografar a senha antes de salvar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Só criptografa se a senha foi modificada
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Verifica se o modelo já foi registrado
module.exports = mongoose.models.User || mongoose.model('User', userSchema);