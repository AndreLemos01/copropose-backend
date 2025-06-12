// backend/src/controllers/proposalController.js
const Proposal = require('../models/proposalModel');

const createProposal = async (req, res) => {
  try {
    const newProposal = await Proposal.create(req.body);
    res.status(201).json(newProposal);
  } catch (error) {
    console.error('Erro ao criar proposta:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const getAllProposals = async (req, res) => {
  try {
    const proposals = await Proposal.findAll();
    res.status(200).json(proposals);
  } catch (error) {
    console.error('Erro ao buscar propostas:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const getProposalById = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposta não encontrada.' });
    }
    res.status(200).json(proposal);
  } catch (error) {
    console.error('Erro ao buscar proposta por ID:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const updateProposal = async (req, res) => {
  try {
    const updatedProposal = await Proposal.update(req.params.id, req.body);
    if (!updatedProposal) {
      return res.status(404).json({ message: 'Proposta não encontrada.' });
    }
    res.status(200).json(updatedProposal);
  } catch (error) {
    console.error('Erro ao atualizar proposta:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const deleteProposal = async (req, res) => {
  try {
    const deletedProposal = await Proposal.delete(req.params.id);
    if (!deletedProposal) {
      return res.status(404).json({ message: 'Proposta não encontrada.' });
    }
    res.status(200).json({ message: 'Proposta deletada com sucesso.', proposal: deletedProposal });
  } catch (error) {
    console.error('Erro ao deletar proposta:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

module.exports = {
  createProposal,
  getAllProposals,
  getProposalById,
  updateProposal,
  deleteProposal,
};