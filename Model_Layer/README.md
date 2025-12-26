# Database - Smart Job Portal

## MySQL Database

### Schema Overview

The database consists of 8 main tables:
- **users** - User accounts
- **roles** - User roles
- **user_roles** - User-Role mapping
- **companies** - Company profiles
- **jobs** - Job postings
- **cvs** - User CVs/Resumes
- **applications** - Job applications
- **notifications** - User notifications
- **audit_logs** - System audit trail

### Setup Instructions

1. **Create Database**
   ```bash
   mysql -u root -p < schema.sql
   ```

2. **Load Sample Data**
   ```bash
   mysql -u root -p job_portal_db < data.sql
   ```

### Database Configuration

```sql
Database: job_portal_db
Charset: utf8mb4
Collation: utf8mb4_unicode_ci
Engine: InnoDB
```

### Default Data

Sample data includes:
- 3 users (Admin, Job Seeker, Employer)
- 2 companies
- 4 job postings
- 2 CVs
- 2 applications
- 3 notifications

### Indexes

Optimized indexes on:
- Email lookups
- Job searches
- Application queries
- User role checks

### Relationships

```
users ←→ user_roles ←→ roles
users → companies
companies → jobs
jobs ← applications → users
users → cvs
users → notifications
```

### Backup

```bash
mysqldump -u root -p job_portal_db > backup.sql
```

### Restore

```bash
mysql -u root -p job_portal_db < backup.sql
```
