const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token'); // Ou 'Authorization' se usar Bearer Token

  if (!token) {
    return res.status(401).json({ message: 'Nenhum token, autorização negada.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Adiciona o payload do token ao objeto da requisição
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token não é válido.' });
  }
};

module.exports = authMiddleware;