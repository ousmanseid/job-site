# Smart Job Portal System Documentation

## 1. Executive Summary
The **Smart Job Portal** is a comprehensive, enterprise-grade web application designed to bridge the gap between job seekers and employers. It provides a seamless, secure, and efficient platform for recruitment, application tracking, and career management. Built with a robust **Spring Boot** backend and a dynamic **React (Vite)** frontend, it ensures high performance, scalability, and a premium user experience.

---

## 2. System Architecture

The system follows a modern **Client-Server Microservice-ready Architecture**.

### 2.1 Technology Stack

| Component | Technology | Version | Description |
|-----------|------------|---------|-------------|
| **Frontend** | React.js | 18.2.0 | UI Library |
| | Vite | 5.0.0 | Build Tool & Dev Server |
| | Bootstrap | 5.3.2 | CSS Framework |
| | Axios | 1.6.2 | HTTP Client |
| **Backend** | Java | 17 | Programming Language |
| | Spring Boot | 3.2.0 | Application Framework |
| | Spring Security | 6.2.0 | Auth & Security |
| | Spring Data JPA | 3.2.0 | ORM / Database Layer |
| | Hibernate | 6.x | JPA Implementation |
| | JWT (jjwt) | 0.12.3 | Stateless Authentication |
| **Database** | MySQL | 8.0+ | Relational Database |
| **Tools** | Maven | 3.8+ | Dependency Management |
| | Lombak | 1.18+ | Boilerplate Code Reduction |

### 2.2 High-Level Architecture Diagram
```mermaid
graph TD
    Client[Client Browser (React App)]
    API[Spring Boot REST API]
    DB[(MySQL Database)]

    Client -- HTTP/JSON (Port 3000) --> API
    API -- JDBC (Port 8085) --> DB
```

---

## 3. Core Modules & Features

### 3.1 User Roles & Access Control (RBAC)
The system implements strict Role-Based Access Control with three primary roles:

1.  **Admin**
    *   **Dashboard**: System-wide statistics (Total Jobs, Active Jobs, Users).
    *   **User Management**: View, delete, and manage users.
    *   **Approvals**: Review and approve/reject Employer registrations and Job Postings.
    *   **Settings**: Configure system parameters.
2.  **Employer**
    *   **Dashboard**: Applicant summaries, job performance.
    *   **Job Management**: Post, Edit, Delete, and Close job listings.
    *   **Candidate Review**: View applications, download CVs, contact candidates.
    *   **Profile**: Manage company details (Logo, Description, Verify status).
3.  **Job Seeker**
    *   **Dashboard**: Applied jobs status, Saved jobs.
    *   **Job Search**: Advanced filtering by Location, Category, Type, Salary.
    *   **CV Management**: Build and manage digital CVs/Resumes.
    *   **Application**: One-click apply functionality.

### 3.2 Key Functional Modules

#### A. Authentication Module (`AuthController`)
*   **Registration**: Role-specific registration flows.
*   **Login**: JWT generation upon successful credentials.
*   **Security**: `JwtAuthenticationFilter` intercepts requests to validate tokens.

#### B. Job Management Module (`JobController`, `EmployerController`)
*   **Listing**: Publicly accessible job board with pagination.
*   **Posting**: Rich text support for job descriptions, salary ranges, and requirements.
*   **Status**: Jobs can be Active, Closed, or Pending Approval.

#### C. Application & CV Module (`ApplicationController`, `CVController`)
*   **Application Process**: Links a User (Seeker) to a Job.
*   **CV System**: Allows storage and retrieval of CV documents.
*   **Tracking**: Status updates (e.g., Pending -> Viewed -> Shortlisted -> Rejected).

#### D. Notification System (`NotificationController`)
*   Real-time (or polling-based) notifications for application status changes.

---

## 4. Database Schema Design

The database is normalized to ensure data integrity.

### 4.1 Implementation Entities

*   **Users**: Stores login credentials, roles, and basic profile info.
*   **Roles**: Enumerated roles (ADMIN, EMPLOYER, JOB_SEEKER).
*   **Companies**: Extended profile for Employers (Industry, Website, Verification Status).
*   **Jobs**: Job details, foreign key to Company.
*   **Applications**: Linking table between User and Job, includes status and timestamp.
*   **CVs**: Linked to User, stores resume data/files.
*   **Notifications**: Alert messages for users.
*   **AuditLog**: Records critical system actions for security auditing.

---

## 5. API Reference (Key Endpoints)

### Auth
*   `POST /api/auth/register` - Create new account.
*   `POST /api/auth/login` - Authenticate and receive Bearer token.

### Jobs
*   `GET /api/jobs` - List all active jobs (Searchable).
*   `GET /api/jobs/{id}` - Get detailed job view.
*   `POST /api/employer/jobs` - Post a new job (Review required).
*   `PUT /api/employer/jobs/{id}` - Update job details.

### Applications
*   `POST /api/applications/apply/{jobId}` - Submit application.
*   `GET /api/employer/applications/job/{jobId}` - Get candidates for a job.
*   `PUT /api/employer/applications/{id}/status` - Update candidate status.

### Admin
*   `GET /api/admin/stats` - System health and stats.
*   `PUT /api/admin/companies/{id}/verify` - Verify an employer.

---

## 6. Project Structure

### 6.1 Backend (`/backend`)
```text
src/main/java/com/jobportal/
├── config/          # CORS, Security, Swagger
├── controller/      # REST API Endpoints
├── dto/             # Data Transfer Objects (Request/Response)
├── model/           # JPA Entities
├── repository/      # DB Interactions (Interfaces)
├── security/        # JWT Logic & UserDetails
├── service/         # Business Logic Layer
└── exception/       # Global Error Handling
```

### 6.2 Frontend (`/frontend`)
```text
src/
├── assets/          # Images, Globa Styles
├── components/      # Reusable UI (Navbar, Footer, JobCard)
├── context/         # React Context (Auth State)
├── pages/           # Page Views
│   ├── public/      # Home, Login, Jobs
│   ├── jobseeker/   # Dashboard, Profile, MyApplications
│   ├── employer/    # Dashboard, PostJob, Applicants
│   └── admin/       # Dashboard, Approvals, Users
└── App.jsx          # Route Definitions
```

---

## 7. Installation & Deployment Guide

### Prerequisites
*   Java JDK 17+
*   Node.js & npm
*   MySQL Server

### Step 1: Database Setup
1.  Access MySQL.
2.  Create database: `CREATE DATABASE job_portal_db;`.
3.  The Spring Boot application will automatically initialize the schema (via `schema.sql` or Hibernate ddl-auto).

### Step 2: Backend Setup
1.  Navigate to `/backend`.
2.  Configure `src/main/resources/application.properties` with your DB credentials.
3.  Run: `mvn spring-boot:run`.
4.  Server starts on `http://localhost:8085`.

### Step 3: Frontend Setup
1.  Navigate to `/frontend`.
2.  Install dependencies: `npm install`.
3.  Run dev server: `npm run dev`.
4.  App available at `http://localhost:3000` (or similar).

---

## 8. Development & Contribution Standards

*   **Code Style**: Follow standard Java naming conventions (CamelCase for classes, camelCase for variables) and React component best practices (Functional Components with Hooks).
*   **Commit Messages**: Descriptive messages referencing the feature or fix (e.g., "feat: Add job search filter", "fix: Resolve login redirect bug").
*   **Validation**: Always validate inputs on both client (HTML5/State) and server (Bean Validation) sides.

---

## 9. Future Roadmap

1.  **WebSocket Integration**: For real-time chat between Employer and Candidate.
2.  **AI Recommendations**: Machine learning matching of CV keywords to Job Descriptions.
3.  **Payment Gateway**: Subscription models for premium job postings.
4.  **Mobile App**: React Native adaptation.

---
*Document Generated on: 2025-12-21*
