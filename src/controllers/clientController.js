// backend/src/controllers/clientController.js
const Client = require('../models/clientModel');

const createClient = async (req, res) => {
  try {
    const newClient = await Client.create(req.body);
    res.status(201).json(newClient);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    if (error.code === '23505') { // PostgreSQL unique_violation
      return res.status(400).json({ message: 'CPF/CNPJ já cadastrado.' });
    }
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.status(200).json(clients);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }
    res.status(200).json(client);
  } catch (error) {
    console.error('Erro ao buscar cliente por ID:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const updateClient = async (req, res) => {
  try {
    const updatedClient = await Client.update(req.params.id, req.body);
    if (!updatedClient) {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }
    res.status(200).json(updatedClient);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    if (error.code === '23505') {
        return res.status(400).json({ message: 'CPF/CNPJ já cadastrado para outro cliente.' });
    }
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const deleteClient = async (req, res) => {
  try {
    const deletedClient = await Client.delete(req.params.id);
    if (!deletedClient) {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }
    res.status(200).json({ message: 'Cliente deletado com sucesso.', client: deletedClient });
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

module.exports = {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
};