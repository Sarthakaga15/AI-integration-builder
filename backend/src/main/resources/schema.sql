-- Store API documentation parsing results
CREATE TABLE IF NOT EXISTS api_documentation (
    id BIGSERIAL PRIMARY KEY,
    source_url VARCHAR(500) NOT NULL,
    api_name VARCHAR(255),
    base_url VARCHAR(255),
    auth_type VARCHAR(50), -- bearer, api_key, oauth2
    parsed_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Store generated code
CREATE TABLE IF NOT EXISTS generated_integrations (
    id BIGSERIAL PRIMARY KEY,
    api_doc_id BIGINT REFERENCES api_documentation(id),
    language VARCHAR(50) DEFAULT 'java', -- java, python, nodejs
    generated_code TEXT NOT NULL,
    includes_auth BOOLEAN DEFAULT true,
    includes_pagination BOOLEAN DEFAULT true,
    includes_error_handling BOOLEAN DEFAULT true,
    test_status VARCHAR(50), -- untested, sandbox_success, sandbox_failed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Store user test results (sandbox)
CREATE TABLE IF NOT EXISTS sandbox_tests (
    id BIGSERIAL PRIMARY KEY,
    integration_id BIGINT REFERENCES generated_integrations(id),
    test_endpoint VARCHAR(255),
    status VARCHAR(50), -- success, failed
    response_sample TEXT,
    error_message TEXT,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Store code templates for reuse
CREATE TABLE IF NOT EXISTS code_templates (
    id BIGSERIAL PRIMARY KEY,
    template_name VARCHAR(255) NOT NULL,
    language VARCHAR(50),
    template_code TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Log
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(100), -- code_generated, sandbox_tested, deployed
    integration_name VARCHAR(255),
    environment VARCHAR(50), -- sandbox, production
    success BOOLEAN,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
