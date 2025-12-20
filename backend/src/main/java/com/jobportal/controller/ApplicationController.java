package com.jobportal.controller;

import com.jobportal.model.Application;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/applications")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/apply/{jobId}")
    @PreAuthorize("hasRole('JOBSEEKER')")
    public ResponseEntity<?> applyForJob(@PathVariable Long jobId, @RequestBody(required = false) String coverLetter,
            Authentication authentication) {
        String email = authentication.getName();
        User applicant = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (applicationRepository.existsByJobAndApplicant(job, applicant)) {
            return ResponseEntity.badRequest().body("You have already applied for this job");
        }

        Application application = Application.builder()
                .job(job)
                .applicant(applicant)
                .coverLetter(coverLetter)
                .status(Application.ApplicationStatus.SUBMITTED)
                .build();

        applicationRepository.save(application);

        // Update application count in Job
        job.setApplicationCount(job.getApplicationCount() + 1);
        jobRepository.save(job);

        return ResponseEntity.ok("Application submitted successfully");
    }

    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('JOBSEEKER')")
    public ResponseEntity<List<Application>> getMyApplications(Authentication authentication) {
        String email = authentication.getName();
        User applicant = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(applicationRepository.findByApplicant(applicant));
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<List<Application>> getApplicationsByJob(@PathVariable Long jobId,
            Authentication authentication) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // Verify if the job belongs to the employer
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getRoles().stream().anyMatch(r -> r.getName() == com.jobportal.model.Role.RoleName.ROLE_ADMIN)) {
            if (job.getCompany() == null || !job.getCompany().getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).build();
            }
        }

        return ResponseEntity.ok(applicationRepository.findByJob(job));
    }

    @PostMapping("/{id}/status")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateApplicationStatus(@PathVariable Long id,
            @RequestParam Application.ApplicationStatus status, @RequestParam(required = false) String notes) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(status);
        if (notes != null)
            application.setEmployerNotes(notes);
        application.setReviewedAt(LocalDateTime.now());

        if (status == Application.ApplicationStatus.SHORTLISTED) {
            application.setIsShortlisted(true);
        } else if (status == Application.ApplicationStatus.REJECTED) {
            application.setIsRejected(true);
        }

        applicationRepository.save(application);
        return ResponseEntity.ok("Application status updated to " + status);
    }
}
