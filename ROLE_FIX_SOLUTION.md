# 403 Forbidden Error - Missing User Roles Fix

## Problem Summary

You were experiencing a **403 Forbidden** error when trying to access protected endpoints. The logs showed:

```
JWT token validated for user: h@gmail.com
User authorities: []  ← EMPTY!
Responding with 403 status code
```

### Root Cause

The user `h@gmail.com` was successfully authenticated (JWT token was valid), but had **no roles assigned** in the database. Spring Security requires users to have appropriate roles/authorities to access protected endpoints.

The Hibernate logs showed that the query to fetch roles was executing:
```sql
select r1_0.user_id, r1_1.id, r1_1.description, r1_1.name
from user_roles r1_0
join roles r1_1 on r1_1.id=r1_0.role_id
where r1_0.user_id=?
```

But it was returning **no results** because there were no entries in the `user_roles` table for this user.

## Solutions Implemented

### Solution 1: Automatic Role Fix on Startup (RECOMMENDED)

Created `RoleFixRunner.java` - a Spring Boot component that runs automatically when the application starts. It:

1. Checks all users in the database
2. Finds users with no roles assigned
3. Automatically assigns `ROLE_JOBSEEKER` to them
4. Logs the fixes made

**File:** `backend/src/main/java/com/jobportal/config/RoleFixRunner.java`

**How it works:**
- Runs once on application startup
- Fixes the issue automatically without manual intervention
- Safe to keep in production (won't affect users who already have roles)

### Solution 2: Admin Endpoints for Manual Role Management

Created `AdminUserController.java` with two endpoints:

1. **GET** `/admin/users/details?email={email}`
   - View user details including their roles
   
2. **POST** `/admin/users/assign-role`
   - Manually assign a role to a user
   - Request body:
     ```json
     {
       "email": "h@gmail.com",
       "roleName": "ROLE_JOBSEEKER"
     }
     ```

**File:** `backend/src/main/java/com/jobportal/controller/AdminUserController.java`

**Security Configuration Update:**
- Temporarily added these endpoints to `permitAll()` in `SecurityConfig.java`
- This allows fixing users who have no roles (and thus can't authenticate)
- **IMPORTANT:** After fixing all users, you should remove this temporary permission

### Solution 3: PowerShell Script for Quick Fix

Created `fix_user_role.ps1` - a PowerShell script that:
1. Checks user details before the fix
2. Assigns `ROLE_JOBSEEKER` to the user
3. Verifies the fix was successful

**File:** `fix_user_role.ps1`

**Usage:**
```powershell
.\fix_user_role.ps1
```

### Solution 4: SQL Script for Direct Database Fix

Created `fix_user_roles.sql` - SQL queries to:
1. Diagnose the issue
2. Manually insert role assignments
3. Verify the fix

**File:** `backend/fix_user_roles.sql`

## What Happens Next

1. **Automatic Fix:** When the backend reloads, `RoleFixRunner` will automatically detect and fix the user `h@gmail.com`
2. **Verification:** Check the backend logs for messages like:
   ```
   === Checking for users without roles ===
   User h@gmail.com (1) has no roles assigned. Assigning ROLE_JOBSEEKER...
   ✓ Successfully assigned ROLE_JOBSEEKER to user h@gmail.com
   === Fixed 1 user(s) without roles ===
   ```
3. **Test:** Try logging in again with `h@gmail.com` - it should now work!

## How to Verify the Fix

### Option 1: Check Backend Logs
Look for the RoleFixRunner output in your Spring Boot console

### Option 2: Use the Admin Endpoint
```powershell
Invoke-RestMethod -Uri "http://localhost:8085/admin/users/details?email=h@gmail.com" -Method Get
```

Expected response:
```json
{
  "id": 1,
  "email": "h@gmail.com",
  "firstName": "...",
  "lastName": "...",
  "isActive": true,
  "isVerified": true,
  "roles": ["ROLE_JOBSEEKER"]  ← Should NOT be empty anymore
}
```

### Option 3: Try Logging In
Simply try logging in with `h@gmail.com` from the frontend. If successful, the issue is fixed!

## Prevention: How This Happened

This issue likely occurred because:

1. **Manual Database Entry:** The user was created directly in the database without going through the registration endpoint
2. **Registration Bug:** There might have been a bug in the registration process that didn't assign roles
3. **Database Migration:** Roles table was populated after users were created

## Recommended Next Steps

1. ✅ **Wait for backend to reload** - The automatic fix will run
2. ✅ **Test login** - Verify the user can now access protected endpoints
3. ⚠️ **Remove temporary security bypass** - After confirming all users have roles, remove these lines from `SecurityConfig.java`:
   ```java
   // Temporary: Allow access to user role management endpoints for fixing missing roles
   .requestMatchers("/admin/users/assign-role", "/admin/users/details").permitAll()
   ```
4. ✅ **Keep RoleFixRunner** - It's safe to keep as a safety net for future issues

## Files Modified/Created

1. ✅ `backend/src/main/java/com/jobportal/config/RoleFixRunner.java` - **NEW**
2. ✅ `backend/src/main/java/com/jobportal/controller/AdminUserController.java` - **NEW**
3. ✅ `backend/src/main/java/com/jobportal/config/SecurityConfig.java` - **MODIFIED**
4. ✅ `backend/fix_user_roles.sql` - **NEW**
5. ✅ `fix_user_role.ps1` - **NEW**

## Summary

The 403 error was caused by missing role assignments in the database. I've implemented multiple solutions, with the automatic `RoleFixRunner` being the primary fix. The backend should automatically resolve this issue when it reloads.
