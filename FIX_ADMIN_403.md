# Admin 403 Error - Complete Fix

## Root Cause
The 403 (Access Denied) error occurs because the JWT token stored in your browser's localStorage doesn't have the `ROLE_ADMIN` authority, or the token is from an old session before the role was properly set.

## Complete Solution

### Step 1: Clear All Browser Data
This is **critical** - you must clear the old JWT token:

1. Open your browser's Developer Tools (Press **F12**)
2. Go to the **Console** tab
3. Run this command:
```javascript
localStorage.clear();
sessionStorage.clear();
console.log('Storage cleared!');
```
4. **Close all browser tabs** for `localhost:3000`
5. **Open a new tab** and go to `http://localhost:3000`

### Step 2: Verify Admin User in Database

Open your MySQL client and run:

```sql
USE job_portal_db;

-- Check if admin user exists and has correct role
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.is_active,
    u.is_verified,
    r.name as role_name
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'admin@sjp.com';
```

**Expected Output:**
```
id | email           | first_name | last_name | is_active | is_verified | role_name
1  | admin@sjp.com   | System     | Admin     | 1         | 1           | ROLE_ADMIN
```

If the role is **NOT** `ROLE_ADMIN`, run this fix:

```sql
USE job_portal_db;

-- Get IDs
SET @admin_role_id = (SELECT id FROM roles WHERE name = 'ROLE_ADMIN');
SET @admin_user_id = (SELECT id FROM users WHERE email = 'admin@sjp.com');

-- Fix the role
DELETE FROM user_roles WHERE user_id = @admin_user_id;
INSERT INTO user_roles (user_id, role_id) VALUES (@admin_user_id, @admin_role_id);

-- Verify
SELECT u.email, r.name 
FROM users u 
JOIN user_roles ur ON u.id = ur.user_id 
JOIN roles r ON ur.role_id = r.id 
WHERE u.email = 'admin@sjp.com';
```

### Step 3: Test Login with Debug Info

1. Go to `http://localhost:3000/login`
2. Open the **Console** tab in Developer Tools (F12)
3. Enter credentials:
   - Email: `admin@sjp.com`
   - Password: `admin123`
4. Click **Login**

**Check the Console Output:**

You should see:
```
Login response: {
  accessToken: "eyJhbGc...",
  role: "ROLE_ADMIN",
  email: "admin@sjp.com",
  firstName: "System",
  lastName: "Admin",
  isVerified: true
}
Raw role: ROLE_ADMIN
Normalized role: admin
Redirecting to admin dashboard
```

### Step 4: Verify the JWT Token

After logging in, check what's in localStorage:

```javascript
// Run this in the browser console
const user = JSON.parse(localStorage.getItem('user'));
console.log('Stored user:', user);
console.log('Role:', user.role);
console.log('Token:', user.accessToken.substring(0, 50) + '...');
```

The role should be `"admin"` (normalized from `ROLE_ADMIN`).

### Step 5: Test Admin Dashboard Access

1. Navigate to `http://localhost:3000/dashboard/admin`
2. Open the **Network** tab in Developer Tools
3. Look for the request to `/api/admin/stats`
4. Click on it and check:
   - **Request Headers** → Should have `Authorization: Bearer <token>`
   - **Response** → Should be `200 OK` with stats data

If you see **403**, check the **Response** tab for the error message.

## Troubleshooting

### Issue: Still getting 403 after clearing localStorage

**Solution**: The backend might be caching the old user data. Restart the backend:

1. Stop the backend (Ctrl+C in the terminal running `mvn spring-boot:run`)
2. Start it again: `mvn spring-boot:run`
3. Wait for "Started JobPortalApplication"
4. Clear localStorage again
5. Try logging in

### Issue: Console shows "Redirecting to admin dashboard" but goes to job seeker page

**Solution**: This means the ProtectedRoute is redirecting you. Check:

```javascript
// In the console, after login
const user = JSON.parse(localStorage.getItem('user'));
console.log('User role:', user.role);
console.log('Expected: admin');
```

If the role is NOT `"admin"`, the AuthContext normalization might be failing. Check the raw login response in the Network tab.

### Issue: Backend logs show "Access Denied"

**Solution**: The JWT token doesn't have the ROLE_ADMIN authority. This means:

1. The token was created before the user had the admin role
2. The token is from a different user

**Fix**: Clear localStorage and log in again to get a fresh token.

## Quick Test Script

Run this in the browser console to do a complete reset and test:

```javascript
// Complete reset
localStorage.clear();
sessionStorage.clear();

// Wait a moment
setTimeout(() => {
    console.log('Storage cleared. Please log in now.');
    console.log('Use: admin@sjp.com / admin123');
}, 1000);
```

## Still Not Working?

If you're still getting 403 errors after following all these steps, please provide:

1. **Console output** from the login attempt
2. **Network tab** screenshot showing the `/api/admin/stats` request and response
3. **Backend logs** from the terminal (the last 50 lines)
4. **Database query result** from Step 2

This will help me identify the exact issue.

## Success Indicators

You'll know it's working when:
1. ✅ Console shows "Redirecting to admin dashboard"
2. ✅ URL changes to `/dashboard/admin`
3. ✅ You see the admin dashboard with stats
4. ✅ No 403 errors in the Network tab
5. ✅ Backend logs show successful requests to `/api/admin/*` endpoints
