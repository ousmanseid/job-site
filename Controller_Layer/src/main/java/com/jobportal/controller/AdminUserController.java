package com.jobportal.controller;

import com.jobportal.model.User;
import com.jobportal.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminUserController {

    @Autowired
    private AdminService adminService;

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

        try {
            adminService.assignRoleToUser(email, roleNameStr);
            User user = adminService.findByEmail(email);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Role assigned successfully");
            response.put("email", email);
            response.put("role", roleNameStr);
            response.put("totalRoles", user.getRoles().size());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Get user details including roles
     * GET /admin/users/details?email=h@gmail.com
     */
    @GetMapping("/details")
    public ResponseEntity<?> getUserDetails(@RequestParam String email) {
        try {
            User user = adminService.findByEmail(email);

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
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
