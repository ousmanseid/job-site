-- Complete fix for jobs table to support Hibernate ENUM mappings
-- This script will update your existing database schema to match the Java entity definitions
-- IMPORTANT: Run this script in MySQL Workbench or your MySQL client

USE job_portal_db;

-- First, let's see what we're working with
SELECT 'Current status column definition:' as info;
SHOW COLUMNS FROM jobs LIKE 'status';

-- Update the status column to properly handle all enum values
-- This changes it from potentially being an ENUM to a VARCHAR that can store any of our Java enum values
ALTER TABLE jobs MODIFY COLUMN status VARCHAR(50) DEFAULT 'PENDING_APPROVAL';

-- Also update job_type to handle enum values (FULL_TIME, PART_TIME, etc.)
ALTER TABLE jobs MODIFY COLUMN job_type VARCHAR(50);

-- Update work_mode to handle enum values (ONSITE, REMOTE, HYBRID)
ALTER TABLE jobs MODIFY COLUMN work_mode VARCHAR(50);

-- Verify the changes
SELECT 'Updated column definitions:' as info;
SHOW COLUMNS FROM jobs WHERE Field IN ('status', 'job_type', 'work_mode');

-- Show any existing jobs and their status values
SELECT 'Existing jobs:' as info;
SELECT id, title, status, job_type, work_mode, created_at FROM jobs LIMIT 10;

SELECT 'Schema update complete!' as result;
