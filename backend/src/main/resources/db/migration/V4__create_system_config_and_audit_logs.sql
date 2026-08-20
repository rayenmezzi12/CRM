CREATE TABLE system_configs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed default system configuration values
INSERT INTO system_configs (config_key, config_value) VALUES ('company_name', 'CRM Enterprise');
INSERT INTO system_configs (config_key, config_value) VALUES ('support_email', 'support@crm.com');
INSERT INTO system_configs (config_key, config_value) VALUES ('currency', 'EUR');
INSERT INTO system_configs (config_key, config_value) VALUES ('maintenance_mode', 'false');

-- Initial audit log entry
INSERT INTO audit_logs (username, action, details) VALUES ('system', 'SYSTEM_INIT', 'System initialized with V4 migration');
