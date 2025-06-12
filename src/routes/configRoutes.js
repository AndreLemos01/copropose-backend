// backend/src/routes/configRoutes.js
const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');
const authMiddleware = require('../utils/authMiddleware'); // Middleware de autenticação

router.use(authMiddleware); // Aplica o middleware de autenticação a todas as rotas de configuração

// Rotas para Formas de Pagamento
router.get('/payment-methods', configController.getPaymentMethods);
router.post('/payment-methods', configController.createPaymentMethod);
router.put('/payment-methods/:id', configController.updatePaymentMethod);
router.delete('/payment-methods/:id', configController.deletePaymentMethod);

// Rotas para Modelos de Introdução
router.get('/introduction-templates', configController.getIntroductionTemplates);
router.post('/introduction-templates', configController.createIntroductionTemplate);
router.put('/introduction-templates/:id', configController.updateIntroductionTemplate);
router.delete('/introduction-templates/:id', configController.deleteIntroductionTemplate);

// Rotas para Modelos de Texto
router.get('/text-templates', configController.getTextTemplates);
router.post('/text-templates', configController.createTextTemplate);
router.put('/text-templates/:id', configController.updateTextTemplate);
router.delete('/text-templates/:id', configController.deleteTextTemplate);

// Rotas para Prazos de Validade
router.get('/validity-periods', configController.getValidityPeriods);
router.post('/validity-periods', configController.createValidityPeriod);
router.delete('/validity-periods/:id', configController.deleteValidityPeriod);

// Rotas para Itens de Proposta Disponíveis
router.get('/available-proposal-items', configController.getAvailableProposalItems);
router.post('/available-proposal-items', configController.createAvailableProposalItem);
router.put('/available-proposal-items/:id', configController.updateAvailableProposalItem);
router.delete('/available-proposal-items/:id', configController.deleteAvailableProposalItem);

// Rotas para Modelos de Papel Timbrado
router.get('/letterhead-templates', configController.getLetterheadTemplates);
router.post('/letterhead-templates', configController.createLetterheadTemplate);
router.put('/letterhead-templates/:id', configController.updateLetterheadTemplate);
router.delete('/letterhead-templates/:id', configController.deleteLetterheadTemplate);

// Rotas para Configurações do Sistema Globais
router.get('/system-settings', configController.getSystemSettings);
// Para atualização, podemos usar PUT para atualizar uma chave específica
router.put('/system-settings/:key', configController.updateSystemSetting);


module.exports = router;