# Backend - Smart Job Portal

## Spring Boot Application

### Technology Stack
- Spring Boot 3.2.0
- Spring Security with JWT
- Spring Data JPA
- MySQL Database
- Maven

### Project Structure
```
backend/
├── src/main/java/com/jobportal/
│   ├── controller/          # REST API endpoints
│   ├── service/             # Business logic layer
│   ├── repository/          # Data access layer
│   ├── model/               # JPA entities
│   ├── security/            # Security configuration
│   ├── config/              # App configuration
│   ├── dto/                 # Data Transfer Objects
│   ├── exception/           # Exception handling
│   └── JobPortalApplication.java
└── src/main/resources/
    └── application.properties
```

### Running the Application

1. **Install Dependencies**
   ```bash
   mvn clean install
   ```

2. **Run Application**
   ```bash
   mvn spring-boot:run
   ```

3. **Build JAR**
   ```bash
   mvn package
   java -jar target/smart-job-portal-1.0.0.jar
   ```

### Configuration

Edit `application.properties` for:
- Database connection
- JWT settings
- File upload paths
- Email configuration

### API Base URL
```
http://localhost:8080/api
```

### Security
- JWT token-based authentication
- BCrypt password encryption
- Role-based authorization
- CORS enabled

### Dependencies
See `pom.xml` for complete list.
