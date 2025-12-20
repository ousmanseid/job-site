package com.jobportal.controller;

import com.jobportal.model.CV;
import com.jobportal.model.User;
import com.jobportal.repository.CVRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cv")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CVController {

    @Autowired
    private CVRepository cvRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasRole('JOBSEEKER')")
    public ResponseEntity<?> createOrUpdateCV(@RequestBody CV cv, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        cv.setUser(user);

        // If it's the first CV, make it default
        if (cvRepository.countByUser(user) == 0) {
            cv.setIsDefault(true);
        }

        CV savedCV = cvRepository.save(cv);
        return ResponseEntity.ok(savedCV);
    }

    @GetMapping("/my-cvs")
    @PreAuthorize("hasRole('JOBSEEKER')")
    public ResponseEntity<List<CV>> getMyCVs(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(cvRepository.findByUser(user));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getCVById(@PathVariable Long id, Authentication authentication) {
        CV cv = cvRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CV not found"));

        // Only owner or Admin/Employer can view
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isAdmin = user.getRoles().stream()
                .anyMatch(r -> r.getName() == com.jobportal.model.Role.RoleName.ROLE_ADMIN);
        boolean isEmployer = user.getRoles().stream()
                .anyMatch(r -> r.getName() == com.jobportal.model.Role.RoleName.ROLE_EMPLOYER);
        boolean isOwner = cv.getUser().getId().equals(user.getId());

        if (!isAdmin && !isEmployer && !isOwner) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(cv);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('JOBSEEKER')")
    public ResponseEntity<?> deleteCV(@PathVariable Long id, Authentication authentication) {
        CV cv = cvRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CV not found"));

        String email = authentication.getName();
        if (!cv.getUser().getEmail().equals(email)) {
            return ResponseEntity.status(403).body("You can only delete your own CV");
        }

        cvRepository.delete(cv);
        return ResponseEntity.ok("CV deleted successfully");
    }

    @PostMapping("/{id}/default")
    @PreAuthorize("hasRole('JOBSEEKER')")
    public ResponseEntity<?> setDefaultCV(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CV> userCvs = cvRepository.findByUser(user);
        for (CV cv : userCvs) {
            cv.setIsDefault(cv.getId().equals(id));
        }
        cvRepository.saveAll(userCvs);

        return ResponseEntity.ok("Default CV updated");
    }
}
