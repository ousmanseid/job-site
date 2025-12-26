package com.jobportal.controller;

import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.service.JobSeekerService;
import com.jobportal.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/jobseeker")
@PreAuthorize("hasRole('JOBSEEKER')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class JobSeekerController {

    @Autowired
    private JobSeekerService jobSeekerService;

    @Autowired
    private UserService userService;

    @Value("${app.profile.dir}")
    private String profileDir;

    @GetMapping("/stats")
    public ResponseEntity<?> getJobSeekerStats(Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            return ResponseEntity.ok(jobSeekerService.getJobSeekerStats(user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/saved-jobs")
    public ResponseEntity<?> getSavedJobs(Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            return ResponseEntity.ok(jobSeekerService.getSavedJobs(user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/saved-jobs/{jobId}")
    public ResponseEntity<?> saveJob(@PathVariable Long jobId, Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            jobSeekerService.saveJob(jobId, user);
            return ResponseEntity.ok("Job saved successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/saved-jobs/{jobId}")
    public ResponseEntity<?> unsaveJob(@PathVariable Long jobId, Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            jobSeekerService.unsaveJob(jobId, user);
            return ResponseEntity.ok("Job removed from saved list");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/recommended")
    public ResponseEntity<?> getRecommendedJobs() {
        return ResponseEntity.ok(jobSeekerService.getRecommendedJobs());
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/profile/{id}")
    @PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')")
    public ResponseEntity<?> getProfileById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(userService.findById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> profileData,
            Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            return ResponseEntity.ok(jobSeekerService.updateProfile(profileData, user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/profile/picture")
    public ResponseEntity<?> uploadProfilePicture(@RequestParam("file") MultipartFile file,
            Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            String imageUrl = jobSeekerService.uploadProfilePicture(file, user, profileDir);
            return ResponseEntity.ok(Map.of("profilePicture", imageUrl));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Could not upload file: " + e.getMessage());
        }
    }

    @GetMapping("/alerts")
    public ResponseEntity<?> getJobAlerts(Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            return ResponseEntity.ok(jobSeekerService.getJobAlerts(user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/alerts")
    public ResponseEntity<?> updateJobAlerts(@RequestBody Map<String, Object> alertData,
            Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            return ResponseEntity.ok(jobSeekerService.updateJobAlerts(alertData, user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/cv")
    public ResponseEntity<?> getCV(Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            return ResponseEntity.ok(jobSeekerService.getCVData(user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
