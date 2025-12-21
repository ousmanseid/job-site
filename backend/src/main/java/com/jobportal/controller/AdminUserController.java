package com.jobportal.controller;

import com.jobportal.model.Role;
import com.jobportal.model.User;
import com.jobportal.repository.RoleRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/admin/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminUserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    /**
     * Emergency endpoint to assign a role to a user
     * POST /admin/users/assign-role
     * Body: { "email": "h@gmail.com", "roleName": "ROLE_JOBSEEKER" }
     */
    @PostMapping("/assign-role")
    public ResponseEntity<?> assignRoleToUser(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String roleNameStr = request.get("roleName");

        if (email == null || roleNameStr == null) {
            return ResponseEntity.badRequest().body("Email and roleName are required");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        Role.RoleName roleName;
        try {
            roleName = Role.RoleName.valueOf(roleNameStr);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid role name: " + roleNameStr);
        }

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        Set<Role> roles = user.getRoles();
        roles.add(role);
        user.setRoles(roles);
        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Role assigned successfully");
        response.put("email", email);
        response.put("role", roleName.name());
        response.put("totalRoles", user.getRoles().size());

        return ResponseEntity.ok(response);
    }

    /**
     * Get user details including roles
     * GET /admin/users/details?email=h@gmail.com
     */
    @GetMapping("/details")
    public ResponseEntity<?> getUserDetails(@RequestParam String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("firstName", user.getFirstName());
        response.put("lastName", user.getLastName());
        response.put("isActive", user.getIsActive());
        response.put("isVerified", user.getIsVerified());
        response.put("roles", user.getRoles().stream()
                .map(role -> role.getName().name())
                .toList());

        return ResponseEntity.ok(response);
    }
}
