// backend/src/routes/proposalRoutes.js
const express = require('express');
const router = express.Router();
const proposalController = require('../controllers/proposalController');
const authMiddleware = require('../utils/authMiddleware'); // Middleware de autenticação

router.use(authMiddleware); // Aplica o middleware de autenticação a todas as rotas de proposta

router.post('/', proposalController.createProposal);
router.get('/', proposalController.getAllProposals);
router.get('/:id', proposalController.getProposalById);
router.put('/:id', proposalController.updateProposal);
router.delete('/:id', proposalController.deleteProposal);

module.exports = router;