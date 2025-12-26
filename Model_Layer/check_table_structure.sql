-- Diagnostic script to check current jobs table structure
-- Run this in MySQL Workbench or command line

USE job_portal_db;

-- Show the current table structure
SHOW CREATE TABLE jobs;

-- Show column details
DESCRIBE jobs;

-- Check if there are any existing jobs
SELECT COUNT(*) as total_jobs FROM jobs;

-- If the status column is an ENUM, this will show the allowed values
SELECT COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'job_portal_db' 
  AND TABLE_NAME = 'jobs' 
  AND COLUMN_NAME = 'status';
