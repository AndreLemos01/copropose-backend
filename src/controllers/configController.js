// backend/src/controllers/configController.js
const Config = require('../models/configModel');

// --- Controladores para Formas de Pagamento ---
const getPaymentMethods = async (req, res) => {
  try {
    const methods = await Config.getPaymentMethods();
    res.status(200).json(methods);
  } catch (error) {
    console.error('Erro ao buscar formas de pagamento:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
const createPaymentMethod = async (req, res) => {
  try {
    const { name, icon_id } = req.body;
    const newMethod = await Config.createPaymentMethod(name, icon_id);
    res.status(201).json(newMethod);
  } catch (error) {
    console.error('Erro ao criar forma de pagamento:', error);
    if (error.code === '23505') {
        return res.status(400).json({ message: 'Forma de pagamento com este nome já existe.' });
    }
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
const updatePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon_id } = req.body;
    const updatedMethod = await Config.updatePaymentMethod(id, name, icon_id);
    if (!updatedMethod) {
      return res.status(404).json({ message: 'Forma de pagamento não encontrada.' });
    }
    res.status(200).json(updatedMethod);
  } catch (error) {
    console.error('Erro ao atualizar forma de pagamento:', error);
    if (error.code === '23505') {
        return res.status(400).json({ message: 'Forma de pagamento com este nome já existe.' });
    }
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
const deletePaymentMethod = async (req, res) => {
  try {
    const deletedMethod = await Config.deletePaymentMethod(req.params.id);
    if (!deletedMethod) {
      return res.status(404).json({ message: 'Forma de pagamento não encontrada.' });
    }
    res.status(200).json({ message: 'Forma de pagamento deletada com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar forma de pagamento:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// --- Controladores para Modelos de Introdução ---
const getIntroductionTemplates = async (req, res) => {
  try {
    const templates = await Config.getIntroductionTemplates();
    res.status(200).json(templates);
  } catch (error) {
    console.error('Erro ao buscar modelos de introdução:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
const createIntroductionTemplate = async (req, res) => {
  try {
    const { content, is_default } = req.body;
    const newTemplate = await Config.createIntroductionTemplate(content, is_default);
    res.status(201).json(newTemplate);
  } catch (error) {
    console.error('Erro ao criar modelo de introdução:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
const updateIntroductionTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, is_default } = req.body;
    const updatedTemplate = await Config.updateIntroductionTemplate(id, content, is_default);
    if (!updatedTemplate) {
      return res.status(404).json({ message: 'Modelo de introdução não encontrado.' });
    }
    res.status(200).json(updatedTemplate);
  } catch (error) {
      console.error('Erro ao atualizar modelo de introdução:', error);
      res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
const deleteIntroductionTemplate = async (req, res) => {
  try {
    const deletedTemplate = await Config.deleteIntroductionTemplate(req.params.id);
    if (!deletedTemplate) {
      return res.status(404).json({ message: 'Modelo de introdução não encontrado.' });
    }
    res.status(200).json({ message: 'Modelo de introdução deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar modelo de introdução:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// --- Controladores para Modelos de Texto ---
const getTextTemplates = async (req, res) => {
  try {
    const templates = await Config.getTextTemplates();
    res.status(200).json(templates);
  } catch (error) {
    console.error('Erro ao buscar modelos de texto:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
const createTextTemplate = async (req, res) => {
  try {
    const { content, is_default } = req.body;
    const newTemplate = await Config.createTextTemplate(content, is_default);
    res.status(201).json(newTemplate);
  } catch (error) {
    console.error('Erro ao criar modelo de texto:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
const updateTextTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, is_default } = req.body;
    const updatedTemplate = await Config.updateTextTemplate(id, content, is_default);
    if (!updatedTemplate) {
      return res.status(404).json({ message: 'Modelo de texto não encontrado.' });
    }
    res.status(200).json(updatedTemplate);
  } catch (error) {
    console.error('Erro ao atualizar modelo de texto:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
const deleteTextTemplate = async (req, res) => {
  try {
    const deletedTemplate = await Config.deleteTextTemplate(req.params.id);
    if (!deletedTemplate) {
      return res.status(404).json({ message: 'Modelo de texto não encontrado.' });
    }
    res.status(200).json({ message: 'Modelo de texto deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar modelo de texto:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// --- Controladores para Prazos de Validade ---
const getValidityPeriods = async (req, res) => {
  try {
    const periods = await Config.getValidityPeriods();
    res.status(200).json(periods);
  } catch (error) {
    console.error('Erro ao buscar prazos de validade:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
const createValidityPeriod = async (req, res) => {
  try {
    const { period } = req.body;
    const newPeriod = await Config.createValidityPeriod(period);
    res.status(201).json(newPeriod);
  } catch (error) {
    console.error('Erro ao criar prazo de validade:', error);
    if (error.code === '23505') {
        return res.status(400).json({ message: 'Este prazo de validade já existe.' });
    }
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
const deleteValidityPeriod = async (req, res) => {
  try {
    const deletedPeriod = await Config.deleteValidityPeriod(req.params.id);
    if (!deletedPeriod) {
      return res.status(404).json({ message: 'Prazo de validade não encontrado.' });
    }
    res.status(200).json({ message: 'Prazo de validade deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar prazo de validade:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// --- Controladores para Itens de Proposta Disponíveis ---
const getAvailableProposalItems = async (req, res) => {
  try {
    const items = await Config.getAvailableProposalItems();
    res.status(200).json(items);
  } catch (error) {
    console.error('Erro ao buscar itens de proposta disponíveis:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
const createAvailableProposalItem = async (req, res) => {
  try {
    const { title, description, style, default_value, variables } = req.body;
    const newItem = await Config.createAvailableProposalItem(title, description, style, default_value, variables);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Erro ao criar item de proposta:', error);
    if (error.code === '23505') {
        return res.status(400).json({ message: 'Item com este título já existe.' });
    }
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
const updateAvailableProposalItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, style, default_value, variables } = req.body;
    const updatedItem = await Config.updateAvailableProposalItem(id, title, description, style, default_value, variables);
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item de proposta não encontrado.' });
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Erro ao atualizar item de proposta:', error);
    if (error.code === '23505') {
        return res.status(400).json({ message: 'Item com este título já existe.' });
    }
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
const deleteAvailableProposalItem = async (req, res) => {
  try {
    const deletedItem = await Config.deleteAvailableProposalItem(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item de proposta não encontrado.' });
    }
    res.status(200).json({ message: 'Item de proposta deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar item de proposta:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// --- Controladores para Modelos de Papel Timbrado ---
const getLetterheadTemplates = async (req, res) => {
  try {
    const templates = await Config.getLetterheadTemplates();
    res.status(200).json(templates);
  } catch (error) {
    console.error('Erro ao buscar modelos de papel timbrado:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
const createLetterheadTemplate = async (req, res) => {
  try {
    const { name, pdf_url } = req.body;
    const newTemplate = await Config.createLetterheadTemplate(name, pdf_url);
    res.status(201).json(newTemplate);
  } catch (error) {
    console.error('Erro ao criar modelo de papel timbrado:', error);
    if (error.code === '23505') {
        return res.status(400).json({ message: 'Modelo de papel timbrado com este nome já existe.' });
    }
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
const updateLetterheadTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, pdf_url } = req.body;
    const updatedTemplate = await Config.updateLetterheadTemplate(id, name, pdf_url);
    if (!updatedTemplate) {
      return res.status(404).json({ message: 'Modelo de papel timbrado não encontrado.' });
    }
    res.status(200).json(updatedTemplate);
  } catch (error) {
    console.error('Erro ao atualizar modelo de papel timbrado:', error);
    if (error.code === '23505') {
        return res.status(400).json({ message: 'Modelo de papel timbrado com este nome já existe.' });
    }
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
const deleteLetterheadTemplate = async (req, res) => {
  try {
    const deletedTemplate = await Config.deleteLetterheadTemplate(req.params.id);
    if (!deletedTemplate) {
      return res.status(404).json({ message: 'Modelo de papel timbrado não encontrado.' });
    }
    res.status(200).json({ message: 'Modelo de papel timbrado deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar modelo de papel timbrado:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// --- Controladores para Configurações do Sistema Globais ---
const getSystemSettings = async (req, res) => {
  try {
    const settings = await Config.getSystemSettings();
    res.status(200).json(settings);
  } catch (error) {
    console.error('Erro ao buscar configurações do sistema:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
const updateSystemSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    const updatedSetting = await Config.updateSystemSetting(key, value);
    res.status(200).json(updatedSetting);
  } catch (error) {
    console.error('Erro ao atualizar configuração do sistema:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

module.exports = {
  getPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  getIntroductionTemplates,
  createIntroductionTemplate,
  updateIntroductionTemplate,
  deleteIntroductionTemplate,
  getTextTemplates,
  createTextTemplate,
  updateTextTemplate,
  deleteTextTemplate,
  getValidityPeriods,
  createValidityPeriod,
  deleteValidityPeriod,
  getAvailableProposalItems,
  createAvailableProposalItem,
  updateAvailableProposalItem,
  deleteAvailableProposalItem,
  getLetterheadTemplates,
  createLetterheadTemplate,
  updateLetterheadTemplate,
  deleteLetterheadTemplate,
  getSystemSettings,
  updateSystemSetting,
};