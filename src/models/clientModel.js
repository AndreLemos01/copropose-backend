// backend/src/models/clientModel.js
const db = require('../config/db');

class Client {
  // Cria um novo cliente no banco de dados
  static async create(clientData) {
    const {
      type, name, cpf_cnpj, email, phone, observation,
      address_cep, address_logradouro, address_street, address_number, address_complement,
      address_neighborhood, address_city, address_state,
      pf_birth_date, pf_gender, pf_marital_status, pf_profession, pf_nationality, pf_naturality,
      pj_opening_date, pj_size, pj_legal_responsible,
      contacts // Este virá do frontend e será inserido em client_contacts
    } = clientData;

    try {
      // Inicia uma transação
      await db.query('BEGIN');

      const result = await db.query(
        `INSERT INTO clients (
          type, name, cpf_cnpj, email, phone, observation,
          address_cep, address_logradouro, address_street, address_number, address_complement,
          address_neighborhood, address_city, address_state,
          pf_birth_date, pf_gender, pf_marital_status, pf_profession, pf_nationality, pf_naturality,
          pj_opening_date, pj_size, pj_legal_responsible
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
        RETURNING *`,
        [
          type, name, cpf_cnpj, email, phone, observation,
          address_cep, address_logradouro, address_street, address_number, address_complement,
          address_neighborhood, address_city, address_state,
          pf_birth_date, pf_gender, pf_marital_status, pf_profession, pf_nationality, pf_naturality,
          pj_opening_date, pj_size, pj_legal_responsible
        ]
      );
      const newClient = result.rows[0];

      // Insere os contatos adicionais na tabela client_contacts
      if (contacts && contacts.length > 0) {
        for (const contact of contacts) {
          if (contact.email || contact.telefone) { // Apenas insere se tiver email ou telefone
            await db.query(
              'INSERT INTO client_contacts (client_id, phone, email) VALUES ($1, $2, $3)',
              [newClient.id, contact.telefone, contact.email]
            );
          }
        }
      }

      await db.query('COMMIT');
      return newClient;
    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  }

  // Busca todos os clientes com seus contatos
  static async findAll() {
    try {
      const clientsResult = await db.query('SELECT * FROM clients ORDER BY name ASC');
      const clients = clientsResult.rows;

      // Para cada cliente, busca seus contatos
      for (let client of clients) {
        const contactsResult = await db.query(
          'SELECT phone, email FROM client_contacts WHERE client_id = $1',
          [client.id]
        );
        client.contacts = contactsResult.rows;
      }
      return clients;
    } catch (error) {
      throw error;
    }
  }

  // Busca um cliente por ID
  static async findById(id) {
    try {
      const clientResult = await db.query('SELECT * FROM clients WHERE id = $1', [id]);
      const client = clientResult.rows[0];

      if (client) {
        const contactsResult = await db.query(
          'SELECT phone, email FROM client_contacts WHERE client_id = $1',
          [client.id]
        );
        client.contacts = contactsResult.rows;
      }
      return client;
    } catch (error) {
      throw error;
    }
  }

  // Atualiza um cliente existente
  static async update(id, clientData) {
    const {
      type, name, cpf_cnpj, email, phone, observation,
      address_cep, address_logradouro, address_street, address_number, address_complement,
      address_neighborhood, address_city, address_state,
      pf_birth_date, pf_gender, pf_marital_status, pf_profession, pf_nationality, pf_naturality,
      pj_opening_date, pj_size, pj_legal_responsible,
      contacts
    } = clientData;

    try {
      await db.query('BEGIN');

      const result = await db.query(
        `UPDATE clients SET
          type = $1, name = $2, cpf_cnpj = $3, email = $4, phone = $5, observation = $6,
          address_cep = $7, address_logradouro = $8, address_street = $9, address_number = $10, address_complement = $11,
          address_neighborhood = $12, address_city = $13, address_state = $14,
          pf_birth_date = $15, pf_gender = $16, pf_marital_status = $17, pf_profession = $18, pf_nationality = $19, pf_naturality = $20,
          pj_opening_date = $21, pj_size = $22, pj_legal_responsible = $23, updated_at = CURRENT_TIMESTAMP
        WHERE id = $24
        RETURNING *`,
        [
          type, name, cpf_cnpj, email, phone, observation,
          address_cep, address_logradouro, address_street, address_number, address_complement,
          address_neighborhood, address_city, address_state,
          pf_birth_date, pf_gender, pf_marital_status, pf_profession, pf_nationality, pf_naturality,
          pj_opening_date, pj_size, pj_legal_responsible,
          id
        ]
      );
      const updatedClient = result.rows[0];

      // Remove contatos antigos e insere os novos
      await db.query('DELETE FROM client_contacts WHERE client_id = $1', [id]);
      if (contacts && contacts.length > 0) {
        for (const contact of contacts) {
          if (contact.email || contact.telefone) {
            await db.query(
              'INSERT INTO client_contacts (client_id, phone, email) VALUES ($1, $2, $3)',
              [id, contact.telefone, contact.email]
            );
          }
        }
      }

      await db.query('COMMIT');
      return updatedClient;
    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  }

  // Deleta um cliente
  static async delete(id) {
    try {
      await db.query('BEGIN');
      // Primeiro, deleta os contatos associados
      await db.query('DELETE FROM client_contacts WHERE client_id = $1', [id]);
      // Depois, deleta o cliente
      const result = await db.query('DELETE FROM clients WHERE id = $1 RETURNING *', [id]);
      await db.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  }
}

module.exports = Client;