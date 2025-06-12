// backend/src/models/configModel.js
const db = require('../config/db');

class Config {
  // Métodos para Formas de Pagamento
  static async getPaymentMethods() {
    const result = await db.query('SELECT * FROM payment_methods ORDER BY name ASC');
    return result.rows;
  }
  static async createPaymentMethod(name, icon_id) {
    const result = await db.query(
      'INSERT INTO payment_methods (name, icon_id) VALUES ($1, $2) RETURNING *',
      [name, icon_id]
    );
    return result.rows[0];
  }
  static async updatePaymentMethod(id, name, icon_id) {
    const result = await db.query(
      'UPDATE payment_methods SET name = $1, icon_id = $2 WHERE id = $3 RETURNING *',
      [name, icon_id, id]
    );
    return result.rows[0];
  }
  static async deletePaymentMethod(id) {
    const result = await db.query('DELETE FROM payment_methods WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }

  // Métodos para Modelos de Introdução
  static async getIntroductionTemplates() {
    const result = await db.query('SELECT * FROM introduction_templates ORDER BY id ASC');
    return result.rows;
  }
  static async createIntroductionTemplate(content, is_default = false) {
    const result = await db.query(
      'INSERT INTO introduction_templates (content, is_default) VALUES ($1, $2) RETURNING *',
      [content, is_default]
    );
    return result.rows[0];
  }
  static async updateIntroductionTemplate(id, content, is_default = false) {
    const result = await db.query(
      'UPDATE introduction_templates SET content = $1, is_default = $2 WHERE id = $3 RETURNING *',
      [content, is_default, id]
    );
    return result.rows[0];
  }
  static async deleteIntroductionTemplate(id) {
    const result = await db.query('DELETE FROM introduction_templates WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }

  // Métodos para Modelos de Texto
  static async getTextTemplates() {
    const result = await db.query('SELECT * FROM text_templates ORDER BY id ASC');
    return result.rows;
  }
  static async createTextTemplate(content, is_default = false) {
    const result = await db.query(
      'INSERT INTO text_templates (content, is_default) VALUES ($1, $2) RETURNING *',
      [content, is_default]
    );
    return result.rows[0];
  }
  static async updateTextTemplate(id, content, is_default = false) {
    const result = await db.query(
      'UPDATE text_templates SET content = $1, is_default = $2 WHERE id = $3 RETURNING *',
      [content, is_default, id]
    );
    return result.rows[0];
  }
  static async deleteTextTemplate(id) {
    const result = await db.query('DELETE FROM text_templates WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }

  // Métodos para Prazos de Validade
  static async getValidityPeriods() {
    const result = await db.query('SELECT * FROM validity_periods ORDER BY period ASC');
    return result.rows;
  }
  static async createValidityPeriod(period) {
    const result = await db.query(
      'INSERT INTO validity_periods (period) VALUES ($1) RETURNING *',
      [period]
    );
    return result.rows[0];
  }
  static async deleteValidityPeriod(id) {
    const result = await db.query('DELETE FROM validity_periods WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }

  // Métodos para Itens de Proposta Disponíveis
  static async getAvailableProposalItems() {
    const result = await db.query('SELECT * FROM available_proposal_items ORDER BY title ASC');
    return result.rows;
  }
  static async createAvailableProposalItem(title, description, style, default_value, variables) {
    const result = await db.query(
      'INSERT INTO available_proposal_items (title, description, style, default_value, variables) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, style, default_value, variables]
    );
    return result.rows[0];
  }
  static async updateAvailableProposalItem(id, title, description, style, default_value, variables) {
    const result = await db.query(
      'UPDATE available_proposal_items SET title = $1, description = $2, style = $3, default_value = $4, variables = $5 WHERE id = $6 RETURNING *',
      [title, description, style, default_value, variables, id]
    );
    return result.rows[0];
  }
  static async deleteAvailableProposalItem(id) {
    const result = await db.query('DELETE FROM available_proposal_items WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }

  // Métodos para Modelos de Papel Timbrado
  static async getLetterheadTemplates() {
    const result = await db.query('SELECT * FROM letterhead_templates ORDER BY name ASC');
    return result.rows;
  }
  static async createLetterheadTemplate(name, pdf_url) {
    const result = await db.query(
      'INSERT INTO letterhead_templates (name, pdf_url) VALUES ($1, $2) RETURNING *',
      [name, pdf_url]
    );
    return result.rows[0];
  }
  static async updateLetterheadTemplate(id, name, pdf_url) {
    const result = await db.query(
      'UPDATE letterhead_templates SET name = $1, pdf_url = $2 WHERE id = $3 RETURNING *',
      [name, pdf_url, id]
    );
    return result.rows[0];
  }
  static async deleteLetterheadTemplate(id) {
    const result = await db.query('DELETE FROM letterhead_templates WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }

  // Métodos para Configurações do Sistema Globais
  static async getSystemSettings() {
    const result = await db.query('SELECT * FROM system_settings');
    // Retorna as configurações como um objeto { key: value } para facilitar o consumo no frontend
    return result.rows.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
  }
  static async updateSystemSetting(key, value) {
    const result = await db.query(
      'INSERT INTO system_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value RETURNING *',
      [key, value]
    );
    return result.rows[0];
  }
}

module.exports = Config;