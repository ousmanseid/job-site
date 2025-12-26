# Admin Login Issue - Debugging Guide

## Problem
When logging in with admin credentials (`admin@sjp.com` / `admin123`), the system redirects to the job seeker dashboard instead of the admin dashboard, and shows a 403 (Access Denied) error.

## What I Fixed

### 1. ProtectedRoute Component
**File**: `frontend/src/components/ProtectedRoute.jsx`

**Before**: When a user tried to access a route they weren't authorized for, it redirected everyone to `/` (home page).

**After**: Now it redirects users to their appropriate dashboard based on their role:
- Admin → `/dashboard/admin`
- Employer → `/dashboard/employer`
- Job Seeker → `/dashboard/jobseeker`

### 2. Added Debug Logging
**File**: `frontend/src/pages/Login.jsx`

Added console.log statements to help debug the login flow. When you log in, check the browser console (F12) to see:
- The full login response
- The raw role value
- The normalized role value
- Which dashboard it's redirecting to

## Testing Steps

### Step 1: Clear Browser Data
1. Open your browser's Developer Tools (F12)
2. Go to the **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Find **Local Storage** → `http://localhost:3000`
4. Delete the `user` key
5. Refresh the page

### Step 2: Test Admin Login
1. Go to `http://localhost:3000/login`
2. Enter:
   - Email: `admin@sjp.com`
   - Password: `admin123`
3. Open the browser console (F12 → Console tab)
4. Click **Login**
5. Check the console output

**Expected Console Output**:
```
Login response: {accessToken: "...", role: "ROLE_ADMIN", ...}
Raw role: ROLE_ADMIN
Normalized role: admin
Redirecting to admin dashboard
```

### Step 3: Verify Database
If the console shows a different role, check the database:

```sql
USE job_portal_db;

-- Check admin user
SELECT u.id, u.email, u.first_name, u.last_name, r.name as role_name
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'admin@sjp.com';
```

**Expected Result**: Should show `ROLE_ADMIN`

## Possible Issues & Solutions

### Issue 1: Admin user doesn't exist
**Solution**: Restart the backend server. The DataInitializer should create it automatically.

### Issue 2: Admin user has wrong role
**Solution**: Run this SQL to fix it:
```sql
USE job_portal_db;

-- Get the admin role ID
SET @admin_role_id = (SELECT id FROM roles WHERE name = 'ROLE_ADMIN');

-- Get the admin user ID
SET @admin_user_id = (SELECT id FROM users WHERE email = 'admin@sjp.com');

-- Update the user's role
DELETE FROM user_roles WHERE user_id = @admin_user_id;
INSERT INTO user_roles (user_id, role_id) VALUES (@admin_user_id, @admin_role_id);
```

### Issue 3: Frontend is caching old user data
**Solution**: 
1. Clear localStorage (as described in Step 1)
2. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

### Issue 4: Backend is not returning the correct role
**Check the backend logs** when you log in. You should see:
```
Hibernate: select ... from users ... where email=?
```

If the role is wrong in the logs, the database needs to be fixed (see Issue 2).

## Quick Fix Commands

### Clear Frontend Cache
```javascript
// Run this in the browser console (F12)
localStorage.clear();
location.reload();
```

### Reset Admin User (Backend)
Restart the backend server. If the admin user already exists, it won't be recreated. To force recreation:

1. Stop the backend
2. Run this SQL:
```sql
USE job_portal_db;
DELETE FROM user_roles WHERE user_id = (SELECT id FROM users WHERE email = 'admin@sjp.com');
DELETE FROM users WHERE email = 'admin@sjp.com';
```
3. Start the backend again

## What to Check Next

1. **Browser Console**: Look for the debug logs I added
2. **Network Tab**: Check the `/api/auth/login` response to see what role is being returned
3. **Backend Logs**: Look for any errors or the SQL queries being executed
4. **Database**: Verify the admin user has the correct role

## Still Not Working?

If you're still having issues after trying these steps, please share:
1. The console output from the browser
2. The backend logs when you log in
3. The result of the database query to check the admin user's role
