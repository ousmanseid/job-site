package com.jobportal.controller;

import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.service.EmployerService;
import com.jobportal.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/employer")
@PreAuthorize("hasRole('EMPLOYER')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class EmployerController {

        @Autowired
        private EmployerService employerService;

        @Autowired
        private UserService userService;

        @GetMapping("/stats")
        public ResponseEntity<?> getEmployerStats(Authentication authentication) {
                try {
                        User user = userService.findByEmail(authentication.getName());
                        return ResponseEntity.ok(employerService.getEmployerStats(user));
                } catch (RuntimeException e) {
                        return ResponseEntity.badRequest().body(e.getMessage());
                }
        }

        @GetMapping("/recent-activity")
        public ResponseEntity<?> getRecentActivity(Authentication authentication) {
                try {
                        User user = userService.findByEmail(authentication.getName());
                        return ResponseEntity.ok(employerService.getRecentActivity(user));
                } catch (RuntimeException e) {
                        return ResponseEntity.badRequest().body(e.getMessage());
                }
        }

        @GetMapping("/jobs")
        public ResponseEntity<?> getEmployerJobs(Authentication authentication) {
                try {
                        User user = userService.findByEmail(authentication.getName());
                        return ResponseEntity.ok(employerService.getEmployerJobs(user));
                } catch (RuntimeException e) {
                        return ResponseEntity.badRequest().body(e.getMessage());
                }
        }

        @GetMapping("/jobs/{id}")
        public ResponseEntity<?> getJobById(@PathVariable Long id, Authentication authentication) {
                try {
                        User user = userService.findByEmail(authentication.getName());
                        return ResponseEntity.ok(employerService.getJobById(id, user));
                } catch (RuntimeException e) {
                        if (e.getMessage().contains("denied")) {
                                return ResponseEntity.status(403).body(e.getMessage());
                        }
                        return ResponseEntity.badRequest().body(e.getMessage());
                }
        }

        @DeleteMapping("/jobs/{id}")
        public ResponseEntity<?> deleteJob(@PathVariable Long id, Authentication authentication) {
                try {
                        User user = userService.findByEmail(authentication.getName());
                        employerService.deleteJob(id, user);
                        return ResponseEntity.ok("Job deleted successfully");
                } catch (RuntimeException e) {
                        if (e.getMessage().contains("denied")) {
                                return ResponseEntity.status(403).body(e.getMessage());
                        }
                        return ResponseEntity.badRequest().body(e.getMessage());
                }
        }

        @PostMapping("/jobs")
        public ResponseEntity<?> createJob(@RequestBody Job job, Authentication authentication) {
                try {
                        User user = userService.findByEmail(authentication.getName());
                        return ResponseEntity.ok(employerService.createJob(job, user));
                } catch (RuntimeException e) {
                        if (e.getMessage().contains("approved")) {
                                return ResponseEntity.status(403).body(e.getMessage());
                        }
                        return ResponseEntity.badRequest().body(e.getMessage());
                } catch (Exception e) {
                        return ResponseEntity.internalServerError().body("Error creating job: " + e.getMessage());
                }
        }

        @PutMapping("/jobs/{id}")
        public ResponseEntity<?> updateJob(@PathVariable Long id, @RequestBody Job jobData,
                        Authentication authentication) {
                try {
                        User user = userService.findByEmail(authentication.getName());
                        return ResponseEntity.ok(employerService.updateJob(id, jobData, user));
                } catch (RuntimeException e) {
                        if (e.getMessage().contains("denied")) {
                                return ResponseEntity.status(403).body(e.getMessage());
                        }
                        return ResponseEntity.badRequest().body(e.getMessage());
                }
        }

        @PutMapping("/jobs/{id}/status")
        public ResponseEntity<?> updateJobStatus(@PathVariable Long id, @RequestParam Job.JobStatus status,
                        Authentication authentication) {
                try {
                        User user = userService.findByEmail(authentication.getName());
                        employerService.updateJobStatus(id, status, user);
                        return ResponseEntity.ok("Job status updated to " + status);
                } catch (RuntimeException e) {
                        if (e.getMessage().contains("denied")) {
                                return ResponseEntity.status(403).body(e.getMessage());
                        }
                        return ResponseEntity.badRequest().body(e.getMessage());
                }
        }

        @GetMapping("/profile")
        public ResponseEntity<?> getProfile(Authentication authentication) {
                try {
                        User user = userService.findByEmail(authentication.getName());
                        return ResponseEntity.ok(employerService.getProfile(user));
                } catch (RuntimeException e) {
                        return ResponseEntity.badRequest().body(e.getMessage());
                }
        }

        @PutMapping("/profile")
        public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> profileData,
                        Authentication authentication) {
                try {
                        User user = userService.findByEmail(authentication.getName());
                        return ResponseEntity.ok(employerService.updateProfile(profileData, user));
                } catch (RuntimeException e) {
                        return ResponseEntity.badRequest().body(e.getMessage());
                }
        }
}
