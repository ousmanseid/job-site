package com.jobportal.controller;

import com.jobportal.model.User;
import com.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User userDetails, Authentication authentication) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String currentUserEmail = authentication.getName();
        if (!user.getEmail().equals(currentUserEmail)) {
            return ResponseEntity.status(403).body("You can only update your own profile");
        }
        
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setPhone(userDetails.getPhone());
        user.setAddress(userDetails.getAddress());
        user.setCity(userDetails.getCity());
        user.setState(userDetails.getState());
        user.setCountry(userDetails.getCountry());
        user.setBio(userDetails.getBio());
        
        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(updatedUser);
    }
}
