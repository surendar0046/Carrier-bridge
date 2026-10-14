-- 001_assessment_tables.down.sql
-- Reversible Rollback for Assessment System (MySQL)

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS assessment_results;
DROP TABLE IF EXISTS assessment_responses;
DROP TABLE IF EXISTS assessment_attempts;
DROP TABLE IF EXISTS question_domain_weights;
DROP TABLE IF EXISTS assessment_questions;
DROP TABLE IF EXISTS dataset_versions;
DROP TABLE IF EXISTS domains;
SET FOREIGN_KEY_CHECKS = 1;
