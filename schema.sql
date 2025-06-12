-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- 'Pessoa Física' ou 'Pessoa Jurídica'
    name VARCHAR(255) NOT NULL,
    cpf_cnpj VARCHAR(20) UNIQUE NOT NULL, -- UNIQUE para evitar duplicidade
    email VARCHAR(255),
    phone VARCHAR(50),
    observation TEXT,
    
    -- Endereço
    address_cep VARCHAR(10),
    address_logradouro VARCHAR(50),
    address_street VARCHAR(255),
    address_number VARCHAR(20),
    address_complement VARCHAR(255),
    address_neighborhood VARCHAR(255),
    address_city VARCHAR(255),
    address_state VARCHAR(2), -- UF do estado
    
    -- Campos Pessoa Física
    pf_birth_date DATE,
    pf_gender VARCHAR(50),
    pf_marital_status VARCHAR(50),
    pf_profession VARCHAR(255),
    pf_nationality VARCHAR(255),
    pf_naturality VARCHAR(255),

    -- Campos Pessoa Jurídica
    pj_opening_date DATE,
    pj_size VARCHAR(50), -- Microempresa, Pequena Empresa, etc.
    pj_legal_responsible VARCHAR(255),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para contatos adicionais do cliente (um cliente pode ter múltiplos telefones/emails)
CREATE TABLE IF NOT EXISTS client_contacts (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    phone VARCHAR(50),
    email VARCHAR(255),
    UNIQUE (client_id, phone, email) -- Garante que a combinação seja única para um cliente
);

-- Tabela para Modelos de Formas de Pagamento
CREATE TABLE IF NOT EXISTS payment_methods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    icon_id VARCHAR(50), -- ID do ícone (ex: 'dinheiro', 'credito')
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para Modelos de Introdução (Quill content)
CREATE TABLE IF NOT EXISTS introduction_templates (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para Modelos de Texto (Quill content, corpo principal da proposta)
CREATE TABLE IF NOT EXISTS text_templates (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para Prazos de Validade (Ex: '7 Dias', '30 Dias')
CREATE TABLE IF NOT EXISTS validity_periods (
    id SERIAL PRIMARY KEY,
    period VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para Itens de Proposta Disponíveis (Modelos de Itens que podem ser adicionados à proposta)
CREATE TABLE IF NOT EXISTS available_proposal_items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    style VARCHAR(50) NOT NULL, -- 'simples', 'agrupado', 'detalhado'
    default_value NUMERIC(10, 2), -- Valor padrão para o item (se aplicável)
    variables JSONB, -- JSONB para armazenar a estrutura de variáveis (sub-itens, detalhes técnicos)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para Modelos de Papel Timbrado (URL de PDF ou ID de template)
CREATE TABLE IF NOT EXISTS letterhead_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    pdf_url TEXT, -- URL para o PDF do papel timbrado (se upload externo)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela principal de Propostas
CREATE TABLE IF NOT EXISTS proposals (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE RESTRICT, -- RESTRICT para não deletar cliente com propostas
    type VARCHAR(50) NOT NULL, -- 'contrato', 'avulso', 'ambos'
    introduction_content TEXT, -- Conteúdo da introdução (HTML ou texto)
    model_text_content TEXT, -- Conteúdo do modelo de texto principal (HTML ou texto)
    validity_period VARCHAR(50),
    payment_conditions VARCHAR(255),
    total_value NUMERIC(10, 2),
    status VARCHAR(50) DEFAULT 'enviadas', -- 'rascunho', 'enviadas', 'negociacao', 'aprovada', 'reprovada', 'fechamento'
    description TEXT, -- Observações gerais da proposta
    rejection_reason TEXT, -- Motivo da reprovação
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para os Itens de cada Proposta (Itens de proposal_items)
CREATE TABLE IF NOT EXISTS proposal_items (
    id SERIAL PRIMARY KEY,
    proposal_id INTEGER NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    style VARCHAR(50), -- 'simples', 'agrupado', 'detalhado'
    quantity INTEGER NOT NULL,
    unit_value NUMERIC(10, 2) NOT NULL,
    variables_data JSONB -- JSONB para armazenar os valores e estados das variáveis para cada item da proposta
);

-- Tabela para registrar o histórico de status de cada proposta
CREATE TABLE IF NOT EXISTS proposal_history (
    id SERIAL PRIMARY KEY,
    proposal_id INTEGER NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    event_type VARCHAR(100) NOT NULL, -- Ex: 'Status Alterado', 'Proposta Criada', 'Proposta Editada'
    details JSONB -- JSONB para detalhes do evento (ex: { "from": "enviadas", "to": "aprovada", "reason": "Preço" })
);

-- Tabela para configurações gerais do sistema (ex: nome da empresa, cnpj da empresa)
CREATE TABLE IF NOT EXISTS system_settings (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_clients_cpf_cnpj ON clients (cpf_cnpj);
CREATE INDEX IF NOT EXISTS idx_proposals_client_id ON proposals (client_id);
CREATE INDEX IF NOT EXISTS idx_proposal_items_proposal_id ON proposal_items (proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposal_history_proposal_id ON proposal_history (proposal_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_name ON payment_methods (name);
CREATE INDEX IF NOT EXISTS idx_available_proposal_items_title ON available_proposal_items (title);