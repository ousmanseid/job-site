# Admin Login Redirect Fix

## Issue
When a user with Admin privileges logged in upon using the admin credentials, they were sometimes redirected to the User (Job Seeker) dashboard instead of the Admin Dashboard.

## Root Cause
The `AuthController` in the backend was determining the user's role by picking an arbitrary role from the user's set of roles:
```java
String role = user.getRoles().isEmpty() ? "ROLE_JOBSEEKER" : user.getRoles().iterator().next().getName().name();
```
If an admin user happened to have multiple roles (e.g., both `ROLE_ADMIN` and `ROLE_JOBSEEKER`), the `iterator().next()` method could non-deterministically return `ROLE_JOBSEEKER` depending on the hash set ordering. This caused the frontend to perceive the user as a Job Seeker and redirect them accordingly.

## Fix Implemented
I updated `backend/src/main/java/com/jobportal/controller/AuthController.java` to implement a priority-based role selection logic:
1. Check if the user has `ROLE_ADMIN`. If so, return `ROLE_ADMIN`.
2. check if the user has `ROLE_EMPLOYER`. If so, return `ROLE_EMPLOYER`.
3. Otherwise, fallback to the first available role or `ROLE_JOBSEEKER`.

This ensures that any user with Admin privileges is correctly identified as an Admin by the frontend.

## Verification
- Restarted the backend server to apply changes.
- Validated that `Login.jsx` and `AuthContext.jsx` correctly normalize `ROLE_ADMIN` to `admin` and redirect to `/dashboard/admin`.
