# Smart Job Portal - Comprehensive System Manual
**Version:** 2.0
**Date:** December 21, 2025
**Author:** AntiGravity Engineering Team

---

## 📖 Table of Contents

1.  [Executive Summary](#1-executive-summary)
2.  [Introduction](#2-introduction)
    *   2.1. Purpose of Document
    *   2.2. Project Scope
    *   2.3. User Classes and Characteristics
3.  [System Architecture](#3-system-architecture)
    *   3.1. High-Level Design
    *   3.2. Technology Stack & Rationale
    *   3.3. MVC Design Pattern Implementation
4.  [Functional Modules Deep Dive](#4-functional-modules-deep-dive)
    *   4.1. Authentication & Security Module
    *   4.2. User Management Module
    *   4.3. Job Board & Management Module
    *   4.4. Application Tracking System (ATS)
    *   4.5. Admin Governance Module
5.  [Database Design & Schema](#5-database-design--schema)
    *   5.1. E-R Diagram Description
    *   5.2. Table Definitions
6.  [API Specification & Logic](#6-api-specification--logic)
7.  [Frontend Implementation Strategy](#7-frontend-implementation-strategy)
8.  [User Workflows & Operational Manual](#8-user-workflows--operational-manual)
    *   8.1. For Job Seekers
    *   8.2. For Employers
    *   8.3. For Administrators
9.  [Deployment & Environment Setup](#9-deployment--environment-setup)
10. [Troubleshooting & Maintenance](#10-troubleshooting--maintenance)

---

## 1. Executive Summary

The **Smart Job Portal** is an enterprise-grade web application designed to facilitate the connection between job seekers and employers. Unlike traditional job boards, this system integrates advanced tracking, a robust role-based security model, and a seamless "Apply" workflow fueled by a digital CV system.

The system is built on a **Spring Boot** backend, ensuring high performance, type safety, and scalability, coupled with a **React (Vite)** frontend that delivers a dynamic, single-page application (SPA) experience. This document serves as the "source of truth" for the system's operation, architecture, and maintenance.

---

## 2. Introduction

### 2.1. Purpose of Document
This document provides a complete technical and functional description of the Smart Job Portal. It is intended for software developers, system administrators, and project managers to understand the internal workings, deployment procedures, and logic flows of the application.

### 2.2. Project Scope
The system encompasses:
*   **Public Portal**: Viewing jobs, registering, logging in.
*   **Candidate Portal**: Dashboard, CV management, Application history.
*   **Employer Portal**: Company profile management, Job posting, Candidate review.
*   **Admin Console**: System oversight, User verification, Content moderation.

### 2.3. User Classes
*   **Guest**: Unregistered user. Can only view public jobs and static pages.
*   **Job Seeker**: Verified user looking for work. Can apply and manage profile.
*   **Employer**: Company representative. Can post jobs and hire.
*   **Administrator**: Super-user with full system access.

---

## 3. System Architecture

### 3.1. High-Level Design
The application follows a **Client-Server Microservice-Ready Architecture**. While currently deployed as a monolith for simplicity, the frontend and backend are completely decoupled, communicating solely via RESTful JSON APIs.

*   **Client Layer**: React.js application running in the user's browser.
*   **API Gateway / Server Layer**: Spring Boot Tomcat container listening on port 8085.
*   **Persistence Layer**: MySQL Database listening on port 3306.

### 3.2. Technology Stack & Rationale

#### Backend: Java + Spring Boot 3.2
*   **Why?** Spring Boot provides an "opinionated" view of the Spring platform, allowing for rapid application development. Using Java 17 ensures we leverage the latest LTS features like Records and Pattern Matching (though standard POJOs are used for JPA).
*   **Security**: `Spring Security 6` is the gold standard for authorized access control.
*   **Data**: `Spring Data JPA` eliminates boilerplate SQL, allowing us to interact with the DB using Java interfaces.

#### Frontend: React + Vite
*   **Why?** React's Virtual DOM provides a snappy user experience. Vite is chosen over Create-React-App for its superior build speeds and Heat Module Replacement (HMR).
*   **Styling**: Bootstrap 5 provides a reliable grid system and responsive components, customized with CSS for a "Glassmorphism" aesthetic.

### 3.3. MVC Design Pattern Implementation
The backend strictly adheres to the Model-View-Controller pattern (conceptually, though the "View" is JSON).

1.  **Controller**: (e.g., `JobController`) Recieves HTTP requests. Validates input. Calls Service/Repository. Returns `ResponseEntity`.
2.  **Model**: (e.g., `Job` Entity) A POJO annotated with `@Entity`. Represents a row in the database.
3.  **Repository**: (e.g., `JobRepository`) An interface extending `JpaRepository`. Provides methods like `save()`, `findById()`, `findByStatus()`.

---

## 4. Functional Modules Deep Dive

### 4.1. Authentication & Security Module
**Core Component**: `JwtAuthenticationFilter`
The system is stateless. No sessions are stored on the server.
1.  **Login**: User sends JSON with `email` and `password`.
2.  **Validation**: `AuthenticationManager` checks DB. If valid, `JwtTokenProvider` generates a Base64-encoded encrypted token containing the user's ID and Role.
3.  **Response**: Token is returned to the client.
4.  **Subsequent Requests**: Client adds header `Authorization: Bearer <token>`.
5.  **Filter Interception**: For every request, the Filter parses the token. If valid, it sets the `SecurityContext` for that thread.

### 4.2. User Management Module
*   **Registration**: Handled by `AuthController/register`. It creates a basic `User` record.
*   **Role Logic**:
    *   `Job Seeker`: Active immediately.
    *   `Employer`: Created with `isVerified = false` by default. Requires Admin approval.
    *   `Admin`: Created primarily via database script (`data.sql`) to prevent unauthorized admin creation.

### 4.3. Job Board & Management Module
This is the heart of the system.
*   **Posting a Job**: Employers submit details. State is set to `PENDING_APPROVAL` (if setting enabled) or `OPEN`.
*   **Search Algorithm**: `JobRepository` uses JPA Specifications or custom Native Queries to filter by:
    *   Keyword (LIKE %query%) in Title or Description.
    *   Location (Exact match).
    *   Category (Exact match).
    *   Salary Range (Between min and max).
*   **Expiration**: Jobs have an optional `expiryDate`. Scheduled tasks (future roadmap) can auto-close them.

### 4.4. Application Tracking System (ATS)
*   **The Object**: An `Application` entity links `User` (candidate) and `Job`.
*   **Uniqueness**: A composite unique constraint ensures a user cannot apply to the same job twice.
*   **Status Management**: Enum `ApplicationStatus` manages flow:
    `PENDING` -> `REVIEWED` -> `SHORTLISTED` -> `INTERVIEW` -> `OFFER` -> `ACCEPTED/REJECTED`.
*   **CV Attachment**: The application links to a specific `CV` snapshot or ID, ensuring the employer sees the CV *as it was* (or the current version, depending on logic requirements).

### 4.5. Admin Governance Module
*   **Approvals**: Admin dashboard queries users where `role=EMPLOYER` and `isVerified=false`.
*   **Stats**: Aggregated queries (`COUNT(*)`) provide real-time metrics on dashboard load.

---

## 5. Database Design & Schema

### 5.1. Table Definitions

#### `users`
*   `id` (PK): Long, Auto-increment.
*   `email`: String, Unique, Indexed.
*   `password`: String (BCrypt hash).
*   `name`: String.
*   `is_active`, `is_verified`: Booleans.

#### `roles`
*   `id` (PK)
*   `name`: Enum (ROLE_ADMIN, ROLE_EMPLOYER, ROLE_JOBSEEKER).

#### `companies`
*   `id` (PK)
*   `user_id` (FK): One-to-One with User (Employer).
*   `description`, `website`, `logo_url`.

#### `jobs`
*   `id` (PK)
*   `company_id` (FK): Many-to-One with Company.
*   `title`, `description`, `location`, `salary`.
*   `type`: Enum (FULL_TIME, PART_TIME, REMOTE).
*   `status`: Enum (OPEN, CLOSED, PENDING).
*   `created_at`, `updated_at`.

#### `cvs`
*   `id` (PK)
*   `user_id` (FK): Many-to-One (Users can have multiple CV variants).
*   `file_name`, `file_type`.
*   `data`: LOB (Large Object) - Stores the binary file data (PDF/Doc) directly in DB or Path to file.

#### `applications`
*   `id` (PK)
*   `job_id` (FK)
*   `user_id` (FK) - The candidate.
*   `cv_id` (FK) - The specific CV used.
*   `status`: Enum.
*   `applied_at`: Timestamp.

---

## 6. API Specification & Logic

All API endpoints are prefixed with `/api`.

### **Auth Domain**
*   `POST /auth/login`: Returns JWT.
*   `POST /auth/register`: Creates User + Default Role.

### **Employer Domain**
*   `POST /employer/jobs`: Creates Job.
    *   *Logic*: Checks if Requester has ROLE_EMPLOYER. Auto-assigns `company_id` from logged-in user context.
*   `GET /employer/applications`: Returns list of applications for ANY job owned by this employer.

### **Job Seeker Domain**
*   `POST /applications/apply/{jobId}`:
    *   *Logic*:
        1. Check if Job exists.
        2. Check if Job is OPEN.
        3. Check if User already applied.
        4. Create Application record.
*   `POST /users/cv`: Uploads a file.
    *   *Logic*: Validates file size (<5MB) and type (PDF/DOCX). Stores byte[] to DB.

### **Admin Domain**
*   `PUT /admin/users/{id}/verify`: Toggles `isVerified` flag.
*   `GET /admin/stats`: Heavy query calculating system totals.

---

## 7. Frontend Implementation Strategy

### Component Hierarchy
*   **App.jsx**: The root. Handles Routing (`react-router-dom`) and Global Global Providers (`AuthProvider`).
*   **Context**:
    *   `AuthContext`: Stores `user` object and `token`. Provides `login()` and `logout()` functions that wrap Axios calls.
*   **Pages Folder**:
    *   Contains "Smart" components that fetch data (e.g., `Jobs.jsx`, `Dashboard.jsx`).
*   **Components Folder**:
    *   Contains "Dumb" (Pure) components (e.g., `JobCard.jsx`, `Navbar.jsx`) that just receive props and render.

### State Management
*   Local state (`useState`) is used for forms and toggleables.
*   Context API is used for User session data.
*   `useEffect` is heavily used for data fetching on component mount.

### API Integration
*   `axiosInstance.js`: A singleton Axios Configuration.
    *   **Interceptor**: Automatically attaches the Authorization header to every outgoing request if a token exists in LocalStorage.

---

## 8. User Workflows & Operational Manual

### 8.1. For Job Seekers
**How to apply for a job:**
1.  **Register/Login**: Navigate to `/register`. Fill form. Login using `/login`.
2.  **Complete Profile**: Ideally, upload a CV first via the Dashboard > My CVs.
3.  **Search**: Go to "Find Jobs". Use filters.
4.  **View**: Click "Details" on a job card.
5.  **Apply**: Click "Apply Now". Select a CV from the dropdown (if uploaded) or upload one on the fly.
6.  **Confirm**: Success message appears. Button changes to "Applied".

### 8.2. For Employers
**How to hire:**
1.  **Register**: Sign up as an Employer.
2.  **Wait**: Account requires Admin Verification (simulated or real).
3.  **Post**: Dashboard > Post Job. Fill details.
4.  **Manage**: Dashboard > My Jobs. See list of active jobs.
5.  **Review**: Click "View Applicants" on a specific job.
6.  **Action**: See list of candidates. Download their CV. Update status to "Interviewing".

### 8.3. For Administrators
**System Maintenance:**
1.  **Login**: Use admin credentials.
2.  **Dashboard**: Check "Pending Approvals".
3.  **Approve/Reject**: Go to Approvals page. Review new companies. Click Approve to grant them posting rights.
4.  **Users**: Use "Manage Users" to ban/delete spam accounts.

---

## 9. Deployment & Environment Setup

### Database
1.  Install MySQL 8.
2.  Create database: `job_portal_db`.
3.  No manual table creation needed if `spring.jpa.hibernate.ddl-auto=update` is set. If `none`, run `Model_Layer/schema.sql`.

### Backend
1.  Open `Controller_Layer/src/main/resources/application.properties`.
2.  Set `spring.datasource.username` and `password`.
3.  Build: `mvn clean install`.
4.  Run: `java -jar target/jobportal-0.0.1-SNAPSHOT.jar`.

### Frontend
1.  Folder: `View_Layer`.
2.  Dependencies: `npm install`.
3.  Dev Mode: `npm run dev`.
4.  Production Build: `npm run build`. This generates a `dist` folder containing static HTML/JS/CSS. These files can be served by Nginx, Apache, or even the Spring Boot static resource handler.

---

## 10. Troubleshooting & Maintenance

### Common Issues

**Issue 1: "CORS Error" in Browser Console**
*   **Cause**: Frontend (Port 3000) tries to talk to Backend (Port 8085) without permission.
*   **Fix**: Check `SecurityConfig.java`. Ensure `AllowedOrigins` includes `http://localhost:3000`.

**Issue 2: "403 Forbidden" on Login**
*   **Cause**: Invalid Token or CSRF blocking.
*   **Fix**: Ensure `csrf` is disabled in `SecurityConfig` (for stateless JWT APIs). Verify Token expiration.

**Issue 3: Files not uploading**
*   **Cause**: File size limit exceeded.
*   **Fix**: Check `application.properties`: `spring.servlet.multipart.max-file-size=5MB`.

### Maintenance Tasks
*   **Log Rotation**: Ensure server logs don't fill up disk space.
*   **Database Backups**: Use `mysqldump` daily.
*   **Token Rotation**: Periodically change the JWT Secret Key in `application.properties` (forces all users to re-login).

---

*This manual constitutes the complete operational guide for the Smart Job Portal system. For further code-level details, refer to the Javadoc in the source files.*
