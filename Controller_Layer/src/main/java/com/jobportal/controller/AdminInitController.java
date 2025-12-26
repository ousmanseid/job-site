package com.jobportal.controller;

import com.jobportal.model.User;
import com.jobportal.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminInitController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/init-admin")
    public ResponseEntity<?> initializeAdmin(@RequestBody AdminInitRequest request) {
        try {
            String message = adminService.initializeAdmin(
                    request.getEmail(),
                    request.getPassword(),
                    request.getFirstName(),
                    request.getLastName());
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/check-user-role")
    public ResponseEntity<?> checkUserRole(@RequestParam String email) {
        try {
            User user = adminService.findByEmail(email);

            List<String> roles = user.getRoles().stream()
                    .map(role -> role.getName().name())
                    .toList();

            return ResponseEntity.ok(new UserRoleInfo(
                    user.getId(),
                    user.getEmail(),
                    user.getFirstName(),
                    user.getLastName(),
                    roles,
                    user.getIsActive(),
                    user.getIsVerified()));
        } catch (RuntimeException e) {
            return ResponseEntity.ok("User not found");
        }
    }

    // Inner classes for request/response
    public static class AdminInitRequest {
        private String email;
        private String password;
        private String firstName;
        private String lastName;

        // Getters and setters
        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }
    }

    public static class UserRoleInfo {
        private Long id;
        private String email;
        private String firstName;
        private String lastName;
        private List<String> roles;
        private Boolean isActive;
        private Boolean isVerified;

        public UserRoleInfo(Long id, String email, String firstName, String lastName,
                List<String> roles, Boolean isActive, Boolean isVerified) {
            this.id = id;
            this.email = email;
            this.firstName = firstName;
            this.lastName = lastName;
            this.roles = roles;
            this.isActive = isActive;
            this.isVerified = isVerified;
        }

        // Getters
        public Long getId() {
            return id;
        }

        public String getEmail() {
            return email;
        }

        public String getFirstName() {
            return firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public List<String> getRoles() {
            return roles;
        }

        public Boolean getIsActive() {
            return isActive;
        }

        public Boolean getIsVerified() {
            return isVerified;
        }
    }
}
