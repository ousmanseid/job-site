<div align="center">
  <img src="frontend/src/assets/logo.png" alt="Smart Job Portal Logo" width="200">
  <h1>Smart Job Portal</h1>
  <p><strong>Your Gateway to Career Success</strong></p>
</div>

A comprehensive full-stack web application for connecting job seekers with employers through an advanced job portal platform.

## 📋 Project Overview

The Smart Job Portal is a large-scale enterprise application featuring:
- Advanced job search and filtering capabilities
- Professional CV/Resume builder
- Employer verification and job posting system
- Role-based access control (Job Seeker, Employer, Admin)
- Application tracking and analytics
- Real-time notifications

## 🛠️ Technology Stack

### Backend
- **Java 17** with **Spring Boot 3.2.0**
- **Spring Security** with JWT authentication
- **Spring Data JPA** with Hibernate
- **MySQL Database**
- **Maven** for dependency management

### Frontend
- **HTML5**, **CSS3**, **JavaScript (ES6+)**
- **Bootstrap 5.3** for responsive design
- **Font Awesome** for icons
- RESTful API integration

### Database
- **MySQL 8.0+**
- Optimized schema with indexes
- Sample data included

## 📁 Project Structure

```
Job-Portal-System/
├── frontend/           # Frontend application
│   ├── assets/         # CSS, JS, images
│   ├── pages/          # HTML pages
│   │   ├── public/     # Public pages (login, register)
│   │   ├── jobseeker/  # Job seeker dashboard
│   │   ├── employer/   # Employer dashboard
│   │   └── admin/      # Admin panel
│   └── index.html      # Landing page
├── backend/            # Spring Boot backend
│   ├── src/main/java/  # Java source code
│   │   └── com/jobportal/
│   │       ├── controller/   # REST controllers
│   │       ├── service/      # Business logic
│   │       ├── repository/   # Data access
│   │       ├── model/        # JPA entities
│   │       ├── security/     # Authentication & Authorization
│   │       ├── config/       # Configuration classes
│   │       ├── dto/          # Data Transfer Objects
│   │       └── exception/    # Exception handlers
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml         # Maven dependencies
└── database/           # Database scripts
    ├── schema.sql      # Database schema
    └── data.sql        # Sample data
```

## 🚀 Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- Modern web browser

### Backend Setup

1. **Configure Database**
   ```bash
   # Create database
   mysql -u root -p < database/schema.sql
   
   # Load sample data
   mysql -u root -p job_portal_db < database/data.sql
   ```

2. **Update Configuration**
   Edit `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=YOUR_USERNAME
   spring.datasource.password=YOUR_PASSWORD
   ```

3. **Build and Run**
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

   The API will be available at: `http://localhost:8080/api`

### Frontend Setup

1. **Start a Local Server**
   ```bash
   cd frontend
   # Using Python
   python3 -m http.server 3000
   
   # Or using Node.js
   npx http-server -p 3000
   ```

2. **Access Application**
   Open your browser and navigate to: `http://localhost:3000`

## 📘 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Job Endpoints

- `GET /api/jobs` - Get all jobs (with pagination)
- `GET /api/jobs/{id}` - Get job by ID
- `GET /api/jobs/search?keyword=...` - Search jobs
- `POST /api/jobs` - Create new job (Employer/Admin only)
- `PUT /api/jobs/{id}` - Update job (Employer/Admin only)
- `DELETE /api/jobs/{id}` - Delete job (Employer/Admin only)

### User Endpoints

- `GET /api/users/me` - Get current user
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user profile

## 👥 User Roles

### Job Seeker
- Search and apply for jobs
- Create and manage CVs
- Track application status
- View analytics

### Employer
- Post and manage jobs
- Review applications
- Shortlist candidates
- Schedule interviews

### Admin
- Manage all users
- Verify companies
- Monitor system activity
- View audit logs

## 🔐 Default Credentials

### Admin
- Email: `admin@jobportal.com`
- Password: `password123`

### Job Seeker
- Email: `john.doe@email.com`
- Password: `password123`

### Employer
- Email: `techcorp@company.com`
- Password: `password123`

## 🔧 Configuration

### JWT Configuration
- Secret key is configured in `application.properties`
- Token expiration: 24 hours
- Refresh token: 7 days

### Database Configuration
- Default port: 3306
- Database name: `job_portal_db`
- Character set: UTF-8

### CORS Configuration
- Allowed origins can be configured in `SecurityConfig.java`
- Default: `http://localhost:3000`, `http://localhost:8081`

## 📝 Features

### Core Features
✅ User registration and authentication  
✅ JWT-based security  
✅ Role-based access control  
✅ Job posting and management  
✅ Advanced job search  
✅ Application management  
✅ CV/Resume builder  
✅ Company verification  
✅ Notifications system  
✅ Analytics dashboard  

### Advanced Features
✅ Pagination and sorting  
✅ Full-text search  
✅ File upload support  
✅ Email notifications  
✅ Audit logging  
✅ Error handling  
✅ Input validation  

## 🐛 Troubleshooting

### Backend Issues
- **Port already in use**: Change server.port in application.properties
- **Database connection failed**: Check MySQL credentials
- **JWT errors**: Verify JWT secret in application.properties

### Frontend Issues
- **CORS errors**: Check CORS configuration in SecurityConfig
- **API calls failing**: Verify backend is running on port 8080
- **Login not working**: Check browser console for errors

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Development

### Code Style
- Follow Java naming conventions
- Use meaningful variable names
- Write JavaDoc for public methods
- Keep methods small and focused

### Testing
```bash
cd backend
mvn test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📧 Support

For issues and questions:
- Check the documentation
- Review existing issues
- Create a new issue with detailed information

---

**Built with ❤️ for the job seeking community**
