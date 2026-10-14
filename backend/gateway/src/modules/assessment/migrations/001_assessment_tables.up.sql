-- 001_assessment_tables.up.sql
-- Transactional Migration for Assessment System

BEGIN;

-- 1. Domains Table
CREATE TABLE IF NOT EXISTS domains (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(64) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed initial default domains if not existing
INSERT INTO domains (id, name, slug, description)
VALUES 
    ('dom_software', 'Software Engineering & Cloud', 'software_development', 'Full stack, systems, web, mobile, and devops engineering'),
    ('dom_data_ai', 'Data Science & Artificial Intelligence', 'data_science', 'Machine learning, generative AI, data engineering, and analytics'),
    ('dom_cybersecurity', 'Cybersecurity & Infrastructure', 'cybersecurity', 'Network security, ethical hacking, SOC analysis, and cloud defense'),
    ('dom_ui_ux', 'UI/UX & Product Design', 'ui_ux_design', 'User research, interaction design, visual systems, and product experience'),
    ('dom_product', 'Product & Technical Management', 'product_management', 'Product strategy, business analysis, tech consulting, and project coordination')
ON CONFLICT (slug) DO NOTHING;

-- 2. Dataset Versions Table
CREATE TABLE IF NOT EXISTS dataset_versions (
    id SERIAL PRIMARY KEY,
    version VARCHAR(64) NOT NULL,
    sha256 VARCHAR(64) NOT NULL UNIQUE,
    filename VARCHAR(255),
    row_count INTEGER NOT NULL DEFAULT 0,
    imported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Assessment Questions Table
CREATE TABLE IF NOT EXISTS assessment_questions (
    id VARCHAR(128) PRIMARY KEY,
    audience VARCHAR(32) NOT NULL, -- '12th' | 'engineering'
    section VARCHAR(32) NOT NULL,  -- 'interest' | 'aptitude' | 'scenario' | 'skill' | 'technical'
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer VARCHAR(8),
    difficulty VARCHAR(16) NOT NULL DEFAULT 'medium',
    explanation TEXT DEFAULT '',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    dataset_version VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Question Domain Weights Table
CREATE TABLE IF NOT EXISTS question_domain_weights (
    id SERIAL PRIMARY KEY,
    question_id VARCHAR(128) NOT NULL REFERENCES assessment_questions(id) ON DELETE CASCADE,
    option_key VARCHAR(8) NOT NULL,
    domain_id VARCHAR(64) NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
    weight INTEGER NOT NULL CHECK (weight >= 0 AND weight <= 3),
    CONSTRAINT uq_q_opt_domain UNIQUE (question_id, option_key, domain_id)
);

-- 5. Assessment Attempts Table
CREATE TABLE IF NOT EXISTS assessment_attempts (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    audience VARCHAR(32) NOT NULL DEFAULT 'engineering',
    stage VARCHAR(64) NOT NULL DEFAULT 'initial',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 6. Assessment Responses Table
CREATE TABLE IF NOT EXISTS assessment_responses (
    id SERIAL PRIMARY KEY,
    attempt_id VARCHAR(64) NOT NULL REFERENCES assessment_attempts(id) ON DELETE CASCADE,
    question_id VARCHAR(128) NOT NULL REFERENCES assessment_questions(id) ON DELETE RESTRICT,
    selected_option VARCHAR(8) NOT NULL,
    is_correct BOOLEAN,
    time_spent_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT uq_attempt_question UNIQUE (attempt_id, question_id)
);

-- 7. Assessment Results Table
CREATE TABLE IF NOT EXISTS assessment_results (
    id SERIAL PRIMARY KEY,
    attempt_id VARCHAR(64) NOT NULL UNIQUE REFERENCES assessment_attempts(id) ON DELETE CASCADE,
    section_scores JSONB NOT NULL,
    top_domains JSONB NOT NULL,
    skill_gaps JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for optimal performance
CREATE INDEX IF NOT EXISTS idx_attempts_user_id ON assessment_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_responses_attempt_id ON assessment_responses(attempt_id);
CREATE INDEX IF NOT EXISTS idx_questions_audience_section ON assessment_questions(audience, section);
CREATE INDEX IF NOT EXISTS idx_questions_is_active ON assessment_questions(is_active);
CREATE INDEX IF NOT EXISTS idx_qweights_qid ON question_domain_weights(question_id);
CREATE INDEX IF NOT EXISTS idx_qweights_domain_id ON question_domain_weights(domain_id);

COMMIT;
