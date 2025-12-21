-- Fix for job status column to handle ENUM values properly
-- Run this script in your MySQL database

USE job_portal_db;

-- Update the status column to handle all possible enum values
ALTER TABLE jobs MODIFY COLUMN status VARCHAR(50) DEFAULT 'PENDING_APPROVAL';

-- Also ensure job_type and work_mode can handle enum values
ALTER TABLE jobs MODIFY COLUMN job_type VARCHAR(50);
ALTER TABLE jobs MODIFY COLUMN work_mode VARCHAR(50);

-- Verify the changes
DESCRIBE jobs;
