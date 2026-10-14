-- 001_assessment_tables.up.sql
-- Migration for Assessment System (MySQL)

CREATE DATABASE IF NOT EXISTS career_bridge;
USE career_bridge;

-- 1. Domains Table
CREATE TABLE IF NOT EXISTS domains (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(64) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial default domains if not existing
INSERT IGNORE INTO domains (id, name, slug, description)
VALUES 
    ('dom_software', 'Software Engineering & Cloud', 'software_development', 'Full stack, systems, web, mobile, and devops engineering'),
    ('dom_data_ai', 'Data Science & Artificial Intelligence', 'data_science', 'Machine learning, generative AI, data engineering, and analytics'),
    ('dom_cybersecurity', 'Cybersecurity & Infrastructure', 'cybersecurity', 'Network security, ethical hacking, SOC analysis, and cloud defense'),
    ('dom_ui_ux', 'UI/UX & Product Design', 'ui_ux_design', 'User research, interaction design, visual systems, and product experience'),
    ('dom_product', 'Product & Technical Management', 'product_management', 'Product strategy, business analysis, tech consulting, and project coordination');

-- 2. Dataset Versions Table
CREATE TABLE IF NOT EXISTS dataset_versions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    version VARCHAR(64) NOT NULL,
    sha256 VARCHAR(64) NOT NULL UNIQUE,
    filename VARCHAR(255),
    row_count INT NOT NULL DEFAULT 0,
    imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Assessment Questions Table
CREATE TABLE IF NOT EXISTS assessment_questions (
    id VARCHAR(128) PRIMARY KEY,
    audience VARCHAR(32) NOT NULL,
    section VARCHAR(32) NOT NULL,
    question TEXT NOT NULL,
    options JSON NOT NULL,
    correct_answer VARCHAR(8),
    difficulty VARCHAR(16) NOT NULL DEFAULT 'medium',
    explanation TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    dataset_version VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_questions_audience_section (audience, section),
    KEY idx_questions_is_active (is_active)
);

-- 4. Question Domain Weights Table
CREATE TABLE IF NOT EXISTS question_domain_weights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id VARCHAR(128) NOT NULL,
    option_key VARCHAR(8) NOT NULL,
    domain_id VARCHAR(64) NOT NULL,
    weight INT NOT NULL,
    CONSTRAINT uq_q_opt_domain UNIQUE (question_id, option_key, domain_id),
    CONSTRAINT fk_qdw_question FOREIGN KEY (question_id) REFERENCES assessment_questions(id) ON DELETE CASCADE,
    CONSTRAINT fk_qdw_domain FOREIGN KEY (domain_id) REFERENCES domains(id) ON DELETE CASCADE,
    KEY idx_qweights_qid (question_id),
    KEY idx_qweights_domain_id (domain_id)
);

-- 5. Assessment Attempts Table
CREATE TABLE IF NOT EXISTS assessment_attempts (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    audience VARCHAR(32) NOT NULL DEFAULT 'engineering',
    stage VARCHAR(64) NOT NULL DEFAULT 'initial',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    KEY idx_attempts_user_id (user_id)
);

-- 6. Assessment Responses Table
CREATE TABLE IF NOT EXISTS assessment_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attempt_id VARCHAR(64) NOT NULL,
    question_id VARCHAR(128) NOT NULL,
    selected_option VARCHAR(8) NOT NULL,
    is_correct BOOLEAN NULL,
    time_spent_seconds INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_attempt_question UNIQUE (attempt_id, question_id),
    CONSTRAINT fk_ar_attempt FOREIGN KEY (attempt_id) REFERENCES assessment_attempts(id) ON DELETE CASCADE,
    CONSTRAINT fk_ar_question FOREIGN KEY (question_id) REFERENCES assessment_questions(id) ON DELETE RESTRICT,
    KEY idx_responses_attempt_id (attempt_id)
);

-- 7. Assessment Results Table
CREATE TABLE IF NOT EXISTS assessment_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attempt_id VARCHAR(64) NOT NULL UNIQUE,
    section_scores JSON NOT NULL,
    top_domains JSON NOT NULL,
    skill_gaps JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_res_attempt FOREIGN KEY (attempt_id) REFERENCES assessment_attempts(id) ON DELETE CASCADE
);
