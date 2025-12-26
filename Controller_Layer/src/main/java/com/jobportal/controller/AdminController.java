package com.jobportal.controller;

import com.jobportal.model.*;
import com.jobportal.service.AdminService;
import com.jobportal.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/employers/pending")
    public ResponseEntity<List<User>> getPendingEmployers() {
        return ResponseEntity.ok(adminService.getPendingEmployers());
    }

    @PostMapping("/users/{id}/approve")
    public ResponseEntity<?> approveUser(@PathVariable Long id) {
        try {
            adminService.approveUser(id);
            return ResponseEntity.ok("User approved successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/users/{id}/deactivate")
    public ResponseEntity<?> deactivateUser(@PathVariable Long id) {
        try {
            adminService.deactivateUser(id);
            return ResponseEntity.ok("User deactivated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/users/{id}/activate")
    public ResponseEntity<?> activateUser(@PathVariable Long id) {
        try {
            adminService.activateUser(id);
            return ResponseEntity.ok("User activated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/jobs/pending")
    public ResponseEntity<?> getPendingJobs() {
        return ResponseEntity.ok(adminService.getPendingJobs());
    }

    @PostMapping("/jobs/{id}/approve")
    public ResponseEntity<?> approveJob(@PathVariable Long id) {
        try {
            adminService.approveJob(id);
            return ResponseEntity.ok("Job approved successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/jobs/{id}/reject")
    public ResponseEntity<?> rejectJob(@PathVariable Long id) {
        try {
            adminService.rejectJob(id);
            return ResponseEntity.ok("Job rejected successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("User deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/recent-applications")
    public ResponseEntity<?> getRecentApplications() {
        return ResponseEntity.ok(adminService.getRecentApplications());
    }

    // CV Templates
    @GetMapping("/cv-templates")
    public ResponseEntity<?> getAllTemplates() {
        return ResponseEntity.ok(adminService.getAllTemplates());
    }

    @PostMapping("/cv-templates")
    public ResponseEntity<?> createTemplate(@RequestBody CVTemplate template) {
        return ResponseEntity.ok(adminService.saveTemplate(template));
    }

    @PutMapping("/cv-templates/{id}")
    public ResponseEntity<?> updateTemplate(@PathVariable Long id, @RequestBody CVTemplate templateData) {
        try {
            return ResponseEntity.ok(adminService.updateTemplate(id, templateData));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/cv-templates/{id}")
    public ResponseEntity<?> deleteTemplate(@PathVariable Long id) {
        adminService.deleteTemplate(id);
        return ResponseEntity.ok("Template deleted");
    }

    // System Settings
    @GetMapping("/settings")
    public ResponseEntity<?> getAllSettings() {
        return ResponseEntity.ok(adminService.getAllSettings());
    }

    @PostMapping("/settings")
    public ResponseEntity<?> updateSettings(@RequestBody List<SystemSetting> settings) {
        adminService.updateSettings(settings);
        return ResponseEntity.ok("Settings updated");
    }
}
