-- 002_onboarding_tables.up.sql
-- Onboarding and Stage-based Pathway System (MySQL / PostgreSQL compatible)

CREATE TABLE IF NOT EXISTS onboarding_questions (
    id VARCHAR(64) PRIMARY KEY,
    stage VARCHAR(32) NOT NULL, -- 'school', 'early', 'final'
    step_number INT NOT NULL,
    question_text TEXT NOT NULL,
    description TEXT,
    question_type VARCHAR(32) NOT NULL DEFAULT 'single', -- 'single', 'multi', 'rating', 'month_picker', 'text'
    options JSON NOT NULL,
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY idx_onboarding_q_stage_step (stage, step_number),
    KEY idx_onboarding_q_active (is_active)
);

CREATE TABLE IF NOT EXISTS onboarding_responses (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    stage VARCHAR(32) NOT NULL,
    answers JSON NOT NULL,
    time_taken_seconds INT DEFAULT 0,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_onboarding_resp_user (user_id),
    KEY idx_onboarding_resp_stage (stage)
);

CREATE TABLE IF NOT EXISTS onboarding_results (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    stage VARCHAR(32) NOT NULL,
    response_id VARCHAR(64) NOT NULL,
    primary_suggestion JSON NOT NULL,
    secondary_suggestion JSON NULL,
    work_path JSON NOT NULL,
    reasons JSON NOT NULL,
    confidence VARCHAR(16) NOT NULL DEFAULT 'High', -- 'High', 'Medium', 'Low'
    reliability_status VARCHAR(32) NOT NULL DEFAULT 'RELIABLE', -- 'RELIABLE', 'SUSPICIOUS_SPEED', 'CONTRADICTORY', 'NEEDS_REVIEW'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_onboarding_res_response FOREIGN KEY (response_id) REFERENCES onboarding_responses(id) ON DELETE CASCADE,
    KEY idx_onboarding_res_user (user_id),
    KEY idx_onboarding_res_stage (stage)
);

CREATE TABLE IF NOT EXISTS user_roadmaps (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    roadmap_id VARCHAR(64) NOT NULL,
    stage VARCHAR(32) NOT NULL,
    target_domain VARCHAR(128) NOT NULL,
    target_role VARCHAR(128) NOT NULL,
    phases JSON NOT NULL,
    active_phase INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_user_roadmaps_user (user_id),
    KEY idx_user_roadmaps_stage (stage)
);
