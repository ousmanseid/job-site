# Fix for "Data truncated for column 'status'" Error

## Problem
When trying to post a job, you're getting a MySQL error: "Data truncated for column 'status' at row 1"

## Root Cause
The database schema was created with `status VARCHAR(50) DEFAULT 'OPEN'`, but the Java application uses Hibernate with `@Enumerated(EnumType.STRING)` which tries to store enum values like "PENDING_APPROVAL", "OPEN", "CLOSED", etc.

There's a mismatch between:
- **Database schema**: Expects simple string values
- **Java Entity**: Uses ENUM with values like `PENDING_APPROVAL` (16 characters)

## Solution

### Step 1: Run the SQL Fix Script

1. Open **MySQL Workbench** or your MySQL client
2. Connect to your database
3. Open the file: `database/fix_enum_columns.sql`
4. Execute the entire script

This will:
- Update the `status` column to properly handle all enum values
- Update `job_type` column (FULL_TIME, PART_TIME, etc.)
- Update `work_mode` column (ONSITE, REMOTE, HYBRID)
- Show you the before/after state

### Step 2: Restart the Backend Server

After running the SQL script:
1. Stop the backend server (Ctrl+C in the terminal running `mvn spring-boot:run`)
2. Start it again: `mvn spring-boot:run`

### Step 3: Test Job Posting

1. Log in as an employer
2. Make sure your account is approved (check with admin if needed)
3. Try posting a job again

## Alternative: Quick Fix via MySQL Command Line

If you prefer command line, run this single command:

```sql
USE job_portal_db;
ALTER TABLE jobs MODIFY COLUMN status VARCHAR(50) DEFAULT 'PENDING_APPROVAL';
ALTER TABLE jobs MODIFY COLUMN job_type VARCHAR(50);
ALTER TABLE jobs MODIFY COLUMN work_mode VARCHAR(50);
```

## Verification

After applying the fix, you should see in the backend logs:
- No more "Data truncated" errors
- Successful INSERT statements for jobs
- The job appearing in your "Manage Jobs" page

## What Changed in the Code

I also updated the backend controller to:
1. Set default status to `PENDING_APPROVAL` (matching the entity default)
2. Add better validation for required fields (title, description)
3. Provide clearer error messages when job posting fails

This means new jobs will require admin approval before appearing in the job listings.
