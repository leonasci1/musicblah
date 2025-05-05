// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/musicblah', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB conectado com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar com o MongoDB:', error);
    process.exit(1); // encerra o processo se não conseguir conectar
  }
};

module.exports = connectDB;
