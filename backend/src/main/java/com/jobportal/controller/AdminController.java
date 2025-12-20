package com.jobportal.controller;

import com.jobportal.model.Role;
import com.jobportal.model.User;
import com.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/employers/pending")
    public ResponseEntity<List<User>> getPendingEmployers() {
        List<User> pendingEmployers = userRepository.findAll().stream()
                .filter(user -> user.getRoles().stream()
                        .anyMatch(role -> role.getName() == Role.RoleName.ROLE_EMPLOYER))
                .filter(user -> !user.getIsVerified())
                .collect(Collectors.toList());
        return ResponseEntity.ok(pendingEmployers);
    }

    @PostMapping("/users/{id}/approve")
    public ResponseEntity<?> approveUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsVerified(true);
        userRepository.save(user);
        return ResponseEntity.ok("User approved successfully");
    }

    @PostMapping("/users/{id}/deactivate")
    public ResponseEntity<?> deactivateUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(false);
        userRepository.save(user);
        return ResponseEntity.ok("User deactivated successfully");
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully");
    }
}
