// backend/src/models/proposalModel.js
const db = require('../config/db');

class Proposal {
  // Cria uma nova proposta
  static async create(proposalData) {
    const {
      client_id, type, introduction_content, model_text_content, validity_period,
      payment_conditions, total_value, status, description, rejection_reason,
      items // Este virá do frontend e será inserido em proposal_items
    } = proposalData;

    try {
      await db.query('BEGIN');

      const result = await db.query(
        `INSERT INTO proposals (
          client_id, type, introduction_content, model_text_content, validity_period,
          payment_conditions, total_value, status, description, rejection_reason
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [
          client_id, type, introduction_content, model_text_content, validity_period,
          payment_conditions, total_value, status, description, rejection_reason
        ]
      );
      const newProposal = result.rows[0];

      // Insere os itens da proposta
      if (items && items.length > 0) {
        for (const item of items) {
          await db.query(
            `INSERT INTO proposal_items (
              proposal_id, title, description, style, quantity, unit_value, variables_data
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              newProposal.id, item.title, item.description, item.style,
              item.quantity, item.valor, item.variaveis // 'valor' e 'variaveis' são como o frontend envia
            ]
          );
        }
      }

      await db.query('COMMIT');
      return newProposal;
    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  }

  // Busca todas as propostas
  static async findAll() {
    try {
      const proposalsResult = await db.query('SELECT * FROM proposals ORDER BY created_at DESC');
      const proposals = proposalsResult.rows;

      // Para cada proposta, busca seus itens
      for (let proposal of proposals) {
        const itemsResult = await db.query(
          'SELECT id, title, description, style, quantity, unit_value, variables_data FROM proposal_items WHERE proposal_id = $1',
          [proposal.id]
        );
        // Renomear 'unit_value' para 'valor' e 'variables_data' para 'variaveis' para compatibilidade com o frontend mock
        proposal.itensSelecionados = itemsResult.rows.map(item => ({
          ...item,
          valor: item.unit_value,
          variaveis: item.variables_data
        }));
      }
      return proposals;
    } catch (error) {
      throw error;
    }
  }

  // Busca uma proposta por ID
  static async findById(id) {
    try {
      const proposalResult = await db.query('SELECT * FROM proposals WHERE id = $1', [id]);
      const proposal = proposalResult.rows[0];

      if (proposal) {
        const itemsResult = await db.query(
          'SELECT id, title, description, style, quantity, unit_value, variables_data FROM proposal_items WHERE proposal_id = $1',
          [proposal.id]
        );
         // Renomear 'unit_value' para 'valor' e 'variables_data' para 'variaveis' para compatibilidade com o frontend mock
        proposal.itensSelecionados = itemsResult.rows.map(item => ({
          ...item,
          valor: item.unit_value,
          variaveis: item.variables_data
        }));
      }
      return proposal;
    } catch (error) {
      throw error;
    }
  }

  // Atualiza uma proposta existente
  static async update(id, proposalData) {
    const {
      client_id, type, introduction_content, model_text_content, validity_period,
      payment_conditions, total_value, status, description, rejection_reason,
      items
    } = proposalData;

    try {
      await db.query('BEGIN');

      const result = await db.query(
        `UPDATE proposals SET
          client_id = $1, type = $2, introduction_content = $3, model_text_content = $4,
          validity_period = $5, payment_conditions = $6, total_value = $7, status = $8,
          description = $9, rejection_reason = $10, updated_at = CURRENT_TIMESTAMP
        WHERE id = $11
        RETURNING *`,
        [
          client_id, type, introduction_content, model_text_content, validity_period,
          payment_conditions, total_value, status, description, rejection_reason,
          id
        ]
      );
      const updatedProposal = result.rows[0];

      // Remove itens antigos e insere os novos
      await db.query('DELETE FROM proposal_items WHERE proposal_id = $1', [id]);
      if (items && items.length > 0) {
        for (const item of items) {
          await db.query(
            `INSERT INTO proposal_items (
              proposal_id, title, description, style, quantity, unit_value, variables_data
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              id, item.title, item.description, item.style,
              item.quantity, item.valor, item.variaveis
            ]
          );
        }
      }

      await db.query('COMMIT');
      return updatedProposal;
    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  }

  // Deleta uma proposta
  static async delete(id) {
    try {
      await db.query('BEGIN');
      // Primeiro, deleta os itens da proposta
      await db.query('DELETE FROM proposal_items WHERE proposal_id = $1', [id]);
      // Depois, deleta a proposta
      const result = await db.query('DELETE FROM proposals WHERE id = $1 RETURNING *', [id]);
      await db.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  }
}

module.exports = Proposal;