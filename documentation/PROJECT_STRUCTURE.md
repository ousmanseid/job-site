# Job Portal System - MVC Project Structure

This document outlines the organization of the codebase based on the **Model-View-Controller (MVC)** architectural pattern. The system is divided into a **Spring Boot Backend** (handling Model and Controller logic) and a **React Frontend** (handling View and Client-side logic).

---

## 🏗️ Backend (Spring Boot)

The backend follows a standard layering architecture mapping directly to MVC concepts.

### 📂 Controller Layer (C)
**Location:** `Controller_Layer/src/main/java/com/jobportal/controller/`

*Handles incoming HTTP requests, processes input, interacts with data repositories, and returns responses.*

| File | Description |
|------|-------------|
| `auth/AuthController.java` | Handles Login, Registration, and JWT Token generation. |
| `AdminController.java` | Admin-specific operations (User approval, stats, settings). |
| `JobController.java` | Public job listing and searching APIs. |
| `EmployerController.java` | Employer specific job management (Post, Edit, Delete). |
| `JobSeekerController.java` | Candidate operations (Apply, Save Job, Profile). |
| `ApplicationController.java` | Manages job application submissions and status updates. |
| `CVController.java` | Handles Resume/CV uploads and retrievals. |
| `NotificationController.java` | Manages user notifications. |

### 📂 Model Layer (M)
**Location:** `Controller_Layer/src/main/java/com/jobportal/model/`

*Represents the data structure and business entities mapped to the database (via JPA).*

| Entity | Description |
|--------|-------------|
| `User.java` | Core user entity (Admin, Employer, Job Seeker). |
| `Role.java` | Enum/Entity for permissions (RBAC). |
| `Job.java` | Job posting details (Title, Salary, Description). |
| `Company.java` | Employer company profile and verification status. |
| `Application.java` | Links User to Job with status (Applied, Interview, etc). |
| `CV.java` | Stores resume metadata or content. |
| `Notification.java` | System alerts for users. |
| `Report.java` | (Optional) Analytical data models. |

### 📂 Data Access Layer (Repository)
**Location:** `Controller_Layer/src/main/java/com/jobportal/repository/`

*Direct interface to the Database (Model interactions).*

- `UserRepository`
- `JobRepository`
- `CompanyRepository`
- `ApplicationRepository`
- ... (One repository per Model entity)

### 📂 Service Layer (Business Logic)
**Location:** `Controller_Layer/src/main/java/com/jobportal/service/`

*Contains complex business rules. Currently, for lightweight operations, logic is handled directly in Controllers or using Repositories.*

---

## 🎨 Frontend (React + Vite)

The frontend adopts a Component-based architecture which acts as the **View** in the broader system context, with its own internal state management.

### 📂 View Layer (V)
**Location:** `View_Layer/src/pages/` & `View_Layer/src/components/`

*Renders the User Interface.*

**Pages (Screens):**
- `Home.jsx` - Landing page.
- `Login.jsx` / `Register.jsx` - Auth screens.
- `JobDetails.jsx` - Full view of a single job.
- `Dashboard/*.jsx` - Role-specific dashboards (Admin, Employer, Seeker).

**Components (Reusable UI):**
- `Navbar.jsx` - Navigation bar.
- `JobCard.jsx` - Summary view of a job in a list.
- `Footer.jsx` - Site footer.

### 📂 Client-Side Controller (Services)
**Location:** `View_Layer/src/services/`

*Manages API communication with the Backend.*

- `AuthService.js` - Login/Register API calls.
- `JobService.js` - Fetch jobs, post jobs.
- `UserService.js` - Profile management.
- `axiosInstance.js` - Configured HTTP client with Token Interceptor.

### 📂 State Management (Local Model)
**Location:** `View_Layer/src/context/`

- `AuthContext.jsx` - Global state for User Authentication (Logged in user data).

---

## 🗂️ File Tree Overview

```text
Job-Portal-System/
├── Controller_Layer/
│   ├── controller/      # (Controller) API Endpoints
│   ├── model/           # (Model) Database Entities
│   ├── repository/      # Data Access
│   ├── security/        # Auth & JWT Configuration
│   └── dto/             # Data Transfer Objects
├── View_Layer/
│   ├── src/
│   │   ├── pages/       # (View) Main Pages
│   │   ├── components/  # (View) Reusable Widgets
│   │   ├── services/    # (Controller) API Logic
│   │   └── context/     # (Model) State Management
└── Model_Layer/
    └── schema.sql       # SQL Definitions
```

*This structure ensures a clean separation of concerns, making the system scalable and maintainable.*
