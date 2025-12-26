package com.jobportal.controller;

import com.jobportal.model.Application;
import com.jobportal.model.CV;
import com.jobportal.model.User;
import com.jobportal.service.ApplicationService;
import com.jobportal.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/applications")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private UserService userService;

    @PostMapping("/apply/{jobId}")
    @PreAuthorize("hasRole('JOBSEEKER')")
    public ResponseEntity<?> applyForJob(@PathVariable Long jobId,
            @RequestBody(required = false) Map<String, Object> request,
            Authentication authentication) {
        String coverLetter = request != null && request.containsKey("coverLetter") ? (String) request.get("coverLetter")
                : "";
        Long cvId = null;
        if (request != null && request.containsKey("cvId")) {
            Object cvIdObj = request.get("cvId");
            if (cvIdObj instanceof Number)
                cvId = ((Number) cvIdObj).longValue();
            else if (cvIdObj instanceof String)
                cvId = Long.parseLong((String) cvIdObj);
        }

        try {
            applicationService.applyForJob(jobId, authentication.getName(), coverLetter, cvId);
            return ResponseEntity.ok("Application submitted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('JOBSEEKER')")
    public ResponseEntity<List<Application>> getMyApplications(Authentication authentication) {
        return ResponseEntity.ok(applicationService.findByApplicantEmail(authentication.getName()));
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<List<Application>> getApplicationsByJob(@PathVariable Long jobId,
            Authentication authentication) {
        try {
            return ResponseEntity.ok(applicationService.findByJobId(jobId, authentication.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).build();
        }
    }

    @GetMapping("/company")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<List<Application>> getCompanyApplications(Authentication authentication) {
        User user = userService.findByEmail(authentication.getName());

        if (user.getCompany() == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(applicationService.findByCompanyId(user.getCompany().getId()));
    }

    @PostMapping("/{id}/status")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateApplicationStatus(@PathVariable Long id,
            @RequestParam Application.ApplicationStatus status, @RequestParam(required = false) String notes) {
        try {
            applicationService.updateApplicationStatus(id, status, notes);
            return ResponseEntity.ok("Application status updated to " + status);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('JOBSEEKER')")
    public ResponseEntity<?> withdrawApplication(@PathVariable Long id, Authentication authentication) {
        try {
            applicationService.withdrawApplication(id, authentication.getName());
            return ResponseEntity.ok("Application withdrawn successfully");
        } catch (RuntimeException e) {
            if (e.getMessage().contains("authorized")) {
                return ResponseEntity.status(403).body(e.getMessage());
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}/cv")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<?> getApplicationCV(@PathVariable Long id, Authentication authentication) {
        try {
            CV cv = applicationService.getApplicationCV(id, authentication.getName());
            if (cv == null)
                return ResponseEntity.notFound().build();
            return ResponseEntity.ok(cv);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).build();
        }
    }
}
