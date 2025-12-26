-- Fix missing roles for user h@gmail.com
-- First, let's check if the user exists and what roles are available

-- Step 1: Find the user ID
SELECT id, email, first_name, last_name FROM users WHERE email = 'h@gmail.com';

-- Step 2: Check existing roles
SELECT * FROM roles;

-- Step 3: Check current user_roles mapping
SELECT ur.*, u.email, r.name 
FROM user_roles ur
JOIN users u ON ur.user_id = u.id
JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'h@gmail.com';

-- Step 4: Insert missing role (assuming user should be ROLE_JOBSEEKER)
-- Replace @user_id and @role_id with actual values from steps 1 and 2
-- Example: If user id is 1 and ROLE_JOBSEEKER id is 1, then:

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'h@gmail.com' 
  AND r.name = 'ROLE_JOBSEEKER'
  AND NOT EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = u.id AND ur.role_id = r.id
  );

-- Verify the fix
SELECT u.email, r.name as role
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'h@gmail.com';
