package com.jobportal.controller;

import com.jobportal.model.Role;
import com.jobportal.model.User;
import com.jobportal.repository.RoleRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminInitController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/init-admin")
    public ResponseEntity<?> initializeAdmin(@RequestBody AdminInitRequest request) {
        try {
            // Check if admin role exists, if not create it
            Role adminRole = roleRepository.findByName(Role.RoleName.ROLE_ADMIN)
                    .orElseGet(() -> {
                        Role newRole = Role.builder()
                                .name(Role.RoleName.ROLE_ADMIN)
                                .description("Administrator role")
                                .build();
                        return roleRepository.save(newRole);
                    });

            // Check if user already exists
            User existingUser = userRepository.findByEmail(request.getEmail()).orElse(null);

            if (existingUser != null) {
                // Update existing user to admin
                Set<Role> roles = new HashSet<>();
                roles.add(adminRole);
                existingUser.setRoles(roles);
                existingUser.setIsActive(true);
                existingUser.setIsVerified(true);
                existingUser.setIsEmailVerified(true);

                // Update password if provided
                if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                    existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
                }

                userRepository.save(existingUser);
                return ResponseEntity.ok("User updated to admin successfully!");
            } else {
                // Create new admin user
                User adminUser = User.builder()
                        .email(request.getEmail())
                        .password(passwordEncoder.encode(request.getPassword()))
                        .firstName(request.getFirstName() != null ? request.getFirstName() : "Admin")
                        .lastName(request.getLastName() != null ? request.getLastName() : "User")
                        .isActive(true)
                        .isVerified(true)
                        .isEmailVerified(true)
                        .build();

                Set<Role> roles = new HashSet<>();
                roles.add(adminRole);
                adminUser.setRoles(roles);

                userRepository.save(adminUser);
                return ResponseEntity.ok("Admin user created successfully!");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/check-user-role")
    public ResponseEntity<?> checkUserRole(@RequestParam String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.ok("User not found");
        }

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
