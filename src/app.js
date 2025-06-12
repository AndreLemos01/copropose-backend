// backend/src/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const proposalRoutes = require('./routes/proposalRoutes');
const configRoutes = require('./routes/configRoutes'); // Certifique-se de importar

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/config', configRoutes); // Adicione esta linha

// Rota de teste
app.get('/', (req, res) => {
  res.send('API do Sistema de Propostas funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});