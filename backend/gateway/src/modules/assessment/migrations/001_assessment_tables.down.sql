-- 001_assessment_tables.down.sql
-- Reversible Rollback for Assessment System

BEGIN;

DROP TABLE IF EXISTS assessment_results CASCADE;
DROP TABLE IF EXISTS assessment_responses CASCADE;
DROP TABLE IF EXISTS assessment_attempts CASCADE;
DROP TABLE IF EXISTS question_domain_weights CASCADE;
DROP TABLE IF EXISTS assessment_questions CASCADE;
DROP TABLE IF EXISTS dataset_versions CASCADE;
DROP TABLE IF EXISTS domains CASCADE;

COMMIT;
